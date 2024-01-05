import { ethers } from "ethers";
import cron from "node-cron";
import { contractABI } from "../client/src/utils/contractABI";
import { contractAddress } from "../client/src/utils/contractAddress";

require("dotenv").config();

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
const privateKey = process.env.PRIVATE_KEY || "";
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    wallet.connect(provider)
);

const gasPrice = ethers.parseUnits("10", "gwei");

// 0 6 * * * - each day
cron.schedule("*/1 * * * *", async () => {
    try {
        console.log("Cron job started");
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
        }
    } catch (error) {
        console.error("Error checking rent end times:", error);
    }
});

console.log("Cron job script loaded");
