require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = process.env.MNEMONIC;

module.exports = {
    networks: {
        bsctest: {
            network_id: "5777",
            provider: () =>
                new HDWalletProvider({
                    mnemonic: {
                        phrase: mnemonic,
                    },
                    providerOrUrl:
                        "https://data-seed-prebsc-1-s1.binance.org:8545",
                }),
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
