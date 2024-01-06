import apartment1 from '/public/apartment1.jpg';
import apartment2 from '/public/apartment2.jpg';
import apartment3 from '/public/apartment3.jpg';
import apartment4 from '/public/apartment4.jpg';
import apartment5 from '/public/apartment5.jpg';
import apartment6 from '/public/apartment6.jpg';

import { ethers } from 'ethers';
import { Property } from '@/interfaces/Property';
import { contractABI } from '@/utils/contractABI';
import { contractAddress } from '@/utils/contractAddress';
import { ContractProperty } from '@/interfaces/ContractProperty';

export const fetchProperties = async (
    setProperties: React.Dispatch<React.SetStateAction<Property[]>>,
    window: Window
) => {
    if (!window.ethereum) {
        console.error('Ethereum object not found');
        return;
    }

    const images = [
        apartment1,
        apartment2,
        apartment3,
        apartment4,
        apartment5,
        apartment6,
    ];

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            provider
        );

        const propertiesFromContract = await contract.getProperties();

        setProperties(
            propertiesFromContract.map(
                (property: ContractProperty, index: number) => ({
                    id: Number(property.id),
                    title: property.title,
                    description: property.description,
                    image: images[index],
                    isRented: property.isRented,
                })
            )
        );
    } catch (error) {
        console.error('Error fetching properties:', error);
    }
};
