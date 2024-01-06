import { ethers } from 'ethers';
import { contractABI } from '@/utils/contractABI';
import { NextApiRequest, NextApiResponse } from 'next';
import { contractAddress } from '@/utils/contractAddress';

require('dotenv').config();
//https://bsc-testnet.publicnode.com

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');
const privateKey = process.env.PRIVATE_KEY || '';
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    wallet.connect(provider)
);

const gasPrice = ethers.parseUnits('10', 'gwei');

export default async function cronJobHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        console.log('Cron job started');
        const properties = await contract.getProperties();
        console.log(`Retrieved ${properties.length} properties`);

        const currentTime = Math.floor(Date.now() / 1000);
        console.log(`Current time: ${currentTime}`);

        let nonce = await provider.getTransactionCount(wallet.address);

        for (const [index, property] of properties.entries()) {
            console.log(`Checking property ${index}`);
            if (property.isRented && property.rentEndTime < currentTime) {
                console.log(`Ending rent for property ${index}`);
                const tx = await contract.endRent(index, {
                    gasPrice,
                    nonce: nonce++,
                });
                await tx.wait();
                console.log(`Ended rent for property ${index}`);
            } else {
                console.log(`No action required for property ${index}`);
            }

            return res
                .status(200)
                .json({ status: 'Cron job executed successfully' });
        }
    } catch (error) {
        console.error('Error checking rent end times:', error);
    }
}

console.log('Cron job script loaded');
