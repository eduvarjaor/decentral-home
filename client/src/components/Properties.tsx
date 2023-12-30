import React, { useState } from 'react';
import { ethers } from 'ethers';
import { parseUnits } from '@ethersproject/units';
import { properties } from '@/utils/properties';
import { contractABI } from '@/utils/contractABI';
import { StaticImageData } from 'next/image';
import Image from 'next/image';
import Modal from 'react-modal';
import bnbLogo from '/public/bnb-logo.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Modal.setAppElement('#page');

interface Property {
    id: number;
    title: string;
    description: string;
    image: StaticImageData;
}

interface PropertiesProps {
    isWalletConnected: boolean;
}

const Properties = ({ isWalletConnected }: PropertiesProps) => {
    const [selectedProperty, setSelectedProperty] = useState<
        Property | undefined
    >(undefined);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setStartDate(null);
        setEndDate(null);
        setIsModalOpen(false);
    };

    const handleRentClick = (property: Property) => {
        if (!isWalletConnected) {
            alert('Please connect to MetaMask.');
            return;
        }
        setSelectedProperty(property);
        setIsModalOpen(true);
    };

    const handleRentConfirm = async () => {
        if (!selectedProperty || !startDate || !endDate || !window.ethereum) {
            console.error('Missing data or Ethereum not available');
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();

        const contractAddress = '0xe5dD9313397e8D31A8CD49BA03746d619cdA7825';

        const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );

        const rentDuration = (endDate.getTime() - startDate.getTime()) / 1000;
        const rentValue = parseUnits('0.01', 'ether');

        try {
            const transaction = await contract.rent(rentDuration, {
                value: rentValue,
            });
            await transaction.wait();
            console.log('Rent successful');

            // Chame outras funções do contrato se necessário
            // Por exemplo, registrar o aluguel
        } catch (error) {
            console.error('Error while renting:', error);
        }
    };

    return (
        <div className="container mx-auto p-4 pt-8">
            <div className="flex justify-center">
                <h1 className="text-4xl font-bold mb-4">
                    Available Properties
                </h1>
            </div>
            <div className="flex flex-wrap">
                {properties.map((property) => (
                    <div
                        key={property.id}
                        className="p-4 w-full md:w-1/2 lg:w-1/3"
                    >
                        <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden shadow-lg">
                            <Image
                                className="lg:h-48 md:h-36 w-full object-cover object-center"
                                src={property.image}
                                alt={property.title}
                                width={400}
                                height={300}
                            />
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-indigo-600 mb-1">
                                    {property.title}
                                </h3>
                                <p className="leading-relaxed mb-5">
                                    {property.description}
                                </p>
                                <div className="flex justify-center">
                                    <button
                                        onClick={() =>
                                            handleRentClick(property)
                                        }
                                        className="text-white bg-black hover:bg-zinc-700 transition ease-in-out duration-150 px-6 py-2 rounded-md flex items-center"
                                    >
                                        <span className="text-sm font-bold mr-2">
                                            0.01 tBNB
                                        </span>
                                        <Image
                                            src={bnbLogo}
                                            alt="BNB logo"
                                            className="w-4 h-4"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Select Rental Period"
                className="max-w-lg w-full p-5 bg-white rounded shadow-xl mx-auto mt-10"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
            >
                {selectedProperty && (
                    <div className="text-center">
                        <Image
                            src={selectedProperty.image}
                            alt={`Image of ${selectedProperty.title}`}
                            width={400}
                            height={300}
                            className="rounded-md mb-4 w-full object-cover object-center"
                        />
                        <h2 className="text-xl font-semibold mb-4">
                            Select Rental Period for {selectedProperty.title}
                        </h2>

                        <div className="flex justify-center space-x-2 mb-4">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                className="bg-slate-200 p-2 rounded-md"
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                className="bg-slate-200 p-2 rounded-md"
                            />
                        </div>

                        <div className="flex justify-around mt-2">
                            <button
                                onClick={closeModal}
                                className="bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline ease-in-out duration-300"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleRentConfirm}
                                disabled={!startDate || !endDate}
                                className={`${
                                    !startDate || !endDate
                                        ? 'bg-blue-300'
                                        : 'bg-blue-500 hover:bg-blue-700'
                                } text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline ease-in-out duration-300`}
                            >
                                Confirm Rent
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Properties;
