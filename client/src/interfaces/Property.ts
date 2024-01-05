import { StaticImageData } from 'next/image';

export interface Property {
    id: number;
    title: string;
    description: string;
    image: StaticImageData;
    isRented: boolean;
    rentEndTime: number;
}
