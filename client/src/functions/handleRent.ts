import moment from 'moment';
import { ethers } from 'ethers';
import { Property } from '@/interfaces/Property';
import { parseUnits } from '@ethersproject/units';

export const handleRentConfirm = async (
    selectedProperty: Property | undefined,
    startDate: Date | null,
    endDate: Date | null,
    setRefetchProperties: React.Dispatch<React.SetStateAction<boolean>>,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    contractAddress: string,
    contractABI: any[],
    window: Window
) => {
    if (!selectedProperty || !startDate || !endDate || !window.ethereum) {
        console.error('Missing data or Ethereum not available');
        return;
    }

    if (!startDate || !endDate) {
        alert('Please select valid start and end dates.');
        return;
    }

    const rentStartTimeUTC = moment.utc(startDate).unix();
    const rentEndTimeUTC = moment.utc(endDate).unix();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const rentValue = parseUnits('0.01', 'ether').toString();

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
        const transaction = await contract.rent(
            selectedProperty.id,
            rentStartTimeUTC,
            rentEndTimeUTC,
            {
                value: rentValue,
            }
        );

        const receipt = await transaction.wait();
        setRefetchProperties((prev) => !prev);
        alert(`Rent successful: ${receipt}`);
        setIsModalOpen(false);
    } catch (error) {
        console.error('Error while renting:', error);
    }
};

export const handleRentClick = (
    property: Property,
    isWalletConnected: boolean,
    setSelectedProperty: React.Dispatch<
        React.SetStateAction<Property | undefined>
    >,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (!isWalletConnected) {
        alert('Please connect to MetaMask.');
        return;
    }
    setSelectedProperty(property);
    setIsModalOpen(true);
};
