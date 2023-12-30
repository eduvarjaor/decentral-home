import React from 'react';
import Image from 'next/image';
import metamask from '/public/metamask.png';

declare global {
    interface Window {
        ethereum?: {
            request: (request: {
                method: string;
                params?: any[];
            }) => Promise<any>;
        };
    }
}

interface HeaderProps {
    isWalletConnected: boolean;
    setIsWalletConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

function Header({ isWalletConnected, setIsWalletConnected }: HeaderProps) {
    async function connectWallet(): Promise<void> {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });

                const account = accounts[0];
                setIsWalletConnected(true);
            } catch (error) {
                console.error('Error connecting to MetaMask', error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    }

    return (
        <div className="bg-zinc-900 w-full flex justify-between p-[1rem]">
            <span className="text-2xl p-2 text-white font-bold">
                Decentral Home
            </span>

            <button
                onClick={connectWallet}
                disabled={isWalletConnected}
                className={`bg-neutral-300 hover:bg-neutral-200 duration-200 ease-in-out p-3 rounded-xl flex text-md shadow-lg ${
                    isWalletConnected ? 'opacity-90 cursor-not-allowed' : ''
                }`}
            >
                {!isWalletConnected ? (
                    <>
                        <Image
                            src={metamask}
                            alt="metamask-logo"
                            className="w-6 h-6 mr-2"
                        />
                        Connect your wallet
                    </>
                ) : (
                    'Connected'
                )}
            </button>
        </div>
    );
}

export default Header;
