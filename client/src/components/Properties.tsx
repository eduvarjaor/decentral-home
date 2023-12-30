import React from 'react';
import Image from 'next/image';
import apartament1 from '/public/apartament1.jpg';
import apartament2 from '/public/apartament2.jpg';
import apartament3 from '/public/apartament3.jpg';
import apartament4 from '/public/apartament4.jpg';
import { FaEthereum } from 'react-icons/fa';

function Properties() {
    const properties = [
        {
            id: 1,
            title: 'Panoramic City Views',
            description:
                'Airy 2-bedroom with ample natural light, in the city center.',
            image: apartament1,
        },
        {
            id: 2,
            title: 'Minimalist Urban Space',
            description:
                'Sleek 2-bedroom with modern design and integrated kitchen.',
            image: apartament2,
        },
        {
            id: 3,
            title: 'Luxury Urban Living',
            description:
                '2-bedroom combining luxury with a high-standard urban lifestyle.',
            image: apartament3,
        },
        {
            id: 4,
            title: 'Charming and Modern',
            description:
                'Cozy 2-bedroom with stylish wood accents and a homely feel.',
            image: apartament4,
        },
    ];

    return (
        <div className="container mx-auto p-4 pt-8">
            <div className="flex justify-center">
                <h1 className="text-4xl font-bold mb-4">
                    Available Properties
                </h1>
            </div>

            <div className="flex flex-wrap">
                {properties.map((property) => (
                    <div key={property.id} className="p-4 md:w-1/2 lg:w-1/4">
                        <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden shadow-md">
                            <Image
                                className="h-48 w-full object-cover object-center"
                                src={property.image}
                                alt={property.title}
                                width={400}
                                height={300}
                            />
                            <div className="p-6">
                                <h3 className="text-base font-medium text-indigo-600 mb-1">
                                    {property.title}
                                </h3>
                                <p className="leading-relaxed mb-5">
                                    {property.description}
                                </p>

                                <div className="flex justify-center">
                                    <button className="text-white bg-black hover:bg-zinc-700 ease-in-out duration-150 p-[0.5rem] w-[40%] rounded-md flex justify-center">
                                        <p className="text-md font-bold">
                                            1 Ether
                                        </p>
                                        <FaEthereum class="w-[20%] h-[88%] ml-[0.3rem]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Properties;
