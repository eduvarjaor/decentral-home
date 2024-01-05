import Image from 'next/image';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import bnbLogo from '/public/bnb-logo.png';
import metamask from '/public/metamask.png';
import 'react-datepicker/dist/react-datepicker.css';

import { Property } from '@/interfaces/Property';
import { contractABI } from '@/utils/contractABI';
import React, { useState, useEffect } from 'react';
import { contractAddress } from '@/utils/contractAddress';
import { handleRentClick } from '@/functions/handleRent';
import { handleRentConfirm } from '@/functions/handleRent';
import { fetchProperties } from '@/functions/fetchProperties';
import { PropertiesProps } from '@/interfaces/PropertiesProps';
import { handleConfirmCancel } from '@/functions/handleCancel';

Modal.setAppElement('#page');

const Properties = ({ isWalletConnected }: PropertiesProps) => {
    const [selectedProperty, setSelectedProperty] = useState<
        Property | undefined
    >(undefined);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [minDate, setMinDate] = useState(new Date());
    const [properties, setProperties] = useState<Property[]>([]);
    const [refetchProperties, setRefetchProperties] = useState<boolean>(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isWalletConnected) {
            fetchProperties(setProperties, window);
        }
    }, [isWalletConnected, refetchProperties, setProperties]);

    const closeModal = () => {
        setStartDate(null);
        setEndDate(null);
        setIsModalOpen(false);
    };

    const onRentConfirmClick = async () => {
        await handleRentConfirm(
            selectedProperty,
            startDate,
            endDate,
            setRefetchProperties,
            setIsModalOpen,
            contractAddress,
            contractABI,
            window
        );
    };

    const onConfirmCancelClick = async () => {
        await handleConfirmCancel(
            selectedProperty,
            setIsCancelModalOpen,
            properties,
            setProperties,
            setRefetchProperties
        );
    };

    const handleRentCancel = () => {
        setIsCancelModalOpen(true);
    };

    const handleCloseCancelModal = () => {
        setIsCancelModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4 pt-8">
            {isWalletConnected && (
                <div className="flex justify-center">
                    <h1 className="text-4xl font-bold mb-4">
                        Available Properties
                    </h1>
                </div>
            )}
            <div className="flex flex-wrap">
                {!isWalletConnected ? (
                    <div className="flex flex-col w-full items-center justify-center min-h-[80vh]">
                        <h1 className="text-4xl font-bold mb-4">
                            Check the properties connecting the Metamask
                        </h1>

                        <Image
                            src={metamask}
                            alt="metamask-logo"
                            className="w-[60vh] h-[60vh]"
                        />
                    </div>
                ) : (
                    ''
                )}
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
                                    {property.isRented ? (
                                        <button
                                            onClick={handleRentCancel}
                                            className="text-white bg-red-500 hover:bg-red-600 duration-150 ease-in-out px-6 py-2 rounded-md flex items-center"
                                        >
                                            Rented
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handleRentClick(
                                                    property,
                                                    isWalletConnected,
                                                    setSelectedProperty,
                                                    setIsModalOpen
                                                )
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
                                    )}
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
                                minDate={minDate}
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
                                onClick={onRentConfirmClick}
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

            <Modal
                isOpen={isCancelModalOpen}
                onRequestClose={handleCloseCancelModal}
                contentLabel="Cancel Rent Confirmation"
                className="max-w-lg w-full p-5 bg-white rounded shadow-xl mx-auto mt-10"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
            >
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">
                        Are you sure to cancel your rent?
                    </h2>
                    <h3 className="mb-5">
                        If you cancel, you will lose 50% of the rent deposit.
                    </h3>
                    <button
                        onClick={onConfirmCancelClick}
                        className="bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline ease-in-out duration-300 mr-2"
                    >
                        Yes
                    </button>
                    <button
                        onClick={handleCloseCancelModal}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline ease-in-out duration-300"
                    >
                        No
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Properties;
