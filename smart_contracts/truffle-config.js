require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
    plugins: ["truffle-plugin-verify"],
    api_keys: {
        bscscan: process.env.BSCSCAN_API_KEY,
    },
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*", // Match any network id
        },
    },
    // networks: {
    //     bsctest: {
    //         network_id: "97",
    //         provider: () =>
    //             new HDWalletProvider({
    //                 mnemonic: {
    //                     phrase: process.env.MNEMONIC,
    //                 },
    //                 providerOrUrl: "https://bsc-testnet.publicnode.com",
    //             }),
    //         gas: 2100000,
    //         gasPrice: 8000000000,
    //         networkCheckTimeout: 10000,
    //         timeoutBlocks: 200,
    //         skipDryRun: true,
    //     },
    // },
    compilers: {
        solc: {
            version: "0.8.0",
            settings: {
                optimizer: {
                    enabled: true, // Default: false
                    runs: 200,
                },
            },
        },
    },
};
