import Image from 'next/image';
import metamask from '/public/metamask.png';

function Header() {
    return (
        <div className="bg-zinc-900 w-full flex justify-between p-[1rem]">
            <span className="text-2xl p-2 text-white font-bold">
                Decentral Home
            </span>

            <button className="bg-neutral-300 hover:bg-neutral-200 duration-200 ease-in-out p-3 rounded-xl flex text-md shadow-lg">
                <Image
                    src={metamask}
                    alt="metamask-logo"
                    className="w-6 h-6 mr-2"
                />
                Connect your wallet
            </button>
        </div>
    );
}

export default Header;
