import React from 'react';
import Image from 'next/image';
import metamask from '/public/metamask.png';
import { HeaderProps } from '@/interfaces/HeaderProps';

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
            <span className="text-2xl lg:p-2 xx:p-0 text-white font-bold">
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
                            className="w-6 h-6 sm:mr-2 xx:mr-0"
                        />
                        <span className="sm:block xx:hidden">
                            Connect your wallet
                        </span>
                    </>
                ) : (
                    'Connected'
                )}
            </button>
        </div>
    );
}

export default Header;
