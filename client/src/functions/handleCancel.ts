import { ethers } from 'ethers';
import { Property } from '@/interfaces/Property';
import { contractABI } from '@/utils/contractABI';
import { contractAddress } from '@/utils/contractAddress';

export const handleConfirmCancel = async (
    selectedProperty: Property | undefined,
    setIsCancelModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    properties: Property[],
    setProperties: React.Dispatch<React.SetStateAction<Property[]>>,
    setRefetchProperties: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (!selectedProperty) return;

    setIsCancelModalOpen(false);

    if (!window.ethereum) {
        console.error('Ethereum object not found in window');
        return;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );

        const userAddressChecksum = ethers.getAddress(
            await signer.getAddress()
        );

        const propertyDetails = await contract.properties(selectedProperty.id);
        const tenantAddressChecksum = ethers.getAddress(propertyDetails.tenant);

        if (userAddressChecksum !== tenantAddressChecksum) {
            console.error('Error: Only the tenant can cancel the rent.');
            return;
        }

        const transaction = await contract.cancelRent(selectedProperty.id);
        const receipt = await transaction.wait();

        const updatedProperties = properties.map((property) => {
            if (property.id === selectedProperty.id) {
                return { ...property, isRented: false };
            }
            return property;
        });
        setProperties(updatedProperties);
        alert(`Rent successful. Transaction Hash: ${receipt.hash}`);
    } catch (error) {
        console.error('Error cancelling rent:', error);
    }

    setRefetchProperties(true);
};
