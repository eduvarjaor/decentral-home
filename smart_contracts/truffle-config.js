require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
    plugins: ["truffle-plugin-verify"],
    api_keys: {
        bscscan: process.env.BSCSCAN_API_KEY,
    },
    networks: {
        bsctest: {
            network_id: "97",
            provider: () =>
                new HDWalletProvider({
                    mnemonic: {
                        phrase: process.env.MNEMONIC,
                    },
                    providerOrUrl:
                        "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
                }),
            gasPrice: 10000000000,
            confirmations: 10,
            timeoutBlocks: 200,

            skipDryRun: true,
        },
    },
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
