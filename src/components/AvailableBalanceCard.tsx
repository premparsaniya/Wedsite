import { useContext, useEffect, useState } from 'react';
import { AppContext } from "~/context";
import Web3 from "web3";
import { goerlyTestNetURL, mainNetURL, USDbalanceOfEth } from "~/utils";
import { getWallet, tokenValueFromWei } from "~/functions";
const { VITE_STATE_COIN_CONTRACT_ADDRESS, VITE_STATE_COIN_CONTRACT_ABI } = import.meta.env;
import { ethers } from "ethers";

const AvailableBalanceCard = () => {
    const { state: { myWallet: { isMainNet, address, privateKey } } } = useContext(AppContext);
    const { state: { myWallet }, dispatch } = useContext(AppContext);
    const web3 = new Web3(isMainNet === true ? mainNetURL : goerlyTestNetURL);

    const [stateEthVal, setStateEthVal] = useState<string>("0");
    const [stateEthUsdVal, setStateEthUsdVal] = useState<string>("0");
    const [stateBalance, setStateBalance] = useState<string>("0");

    useEffect(() => {
        async function getStateBalance() {
            const myContract = new web3.eth.Contract(JSON.parse(VITE_STATE_COIN_CONTRACT_ABI), VITE_STATE_COIN_CONTRACT_ADDRESS)
            const balance = await myContract.methods.balanceOf(address).call();
            setStateBalance(tokenValueFromWei(balance, "18"));
        };

        const getETHBalanceUSD = async () => {
            await fetch(USDbalanceOfEth).then((res) => res.json()).then((res) => {
                // console.log("resETHBalance:", JSON.stringify(res, null, 2));
                if (res?.status === "1") {
                    // setStateEthUsdVal(res?.result?.ethusd || "0");
                    getETHBalance(res?.result?.ethusd === "" ? "0" : res?.result?.ethusd || "0")
                } else setStateEthUsdVal("0");
            }).catch(() => setStateEthUsdVal("0"));
        };

        async function getETHBalance(usd: string) {
            // get ETH Balance from web3 & ethers
            const balance = await web3.eth.getBalance(address ?? "");
            const balanceETH = ethers.utils.formatEther(balance);
            setStateEthVal(balanceETH);
            let toUSD = Number(balanceETH === "" ? "0" : balanceETH || "0") * Number(usd);
            setStateEthUsdVal(toUSD.toFixed(2)); // console.log("balanceETH:", balanceETH);
        };
        if ((privateKey === null) || (address === null)) getWallet({ myWallet, dispatch })
        else { isMainNet && getStateBalance(); getETHBalanceUSD(); };
    }, [address, isMainNet]);

    return (
        <div className="bg-black border border-gray-200 shadow-md rounded-xl max-w-lg w-full p-3.5">
            <span className="mb-2 text-lg text-center text-white font-lato">Available Balance: </span>
            <span className="mb-2 text-lg font-semibold text-center text-white font-lato">$ {stateEthUsdVal}</span>
            <section className="flex flex-col justify-center">
                <div className="flex flex-row my-2 text-2xl font-normal text-white font-lato">
                    {"STATE "}
                    <h3 className="mx-3 text-2xl font-bold text-white font-lato">{stateBalance}</h3>
                </div>
                <div className="flex flex-row text-2xl font-normal text-white font-lato">
                    {"ETH "}
                    <h3 className="mx-3 text-2xl font-bold text-white font-lato">{stateEthVal}</h3>
                </div>
            </section>
        </div>
    )
};

export default AvailableBalanceCard;