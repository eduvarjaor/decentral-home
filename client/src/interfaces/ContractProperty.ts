import { ethers } from 'ethers';

export interface ContractProperty {
    id: ethers.BigNumberish;
    title: string;
    description: string;
    isRented: boolean;
}
