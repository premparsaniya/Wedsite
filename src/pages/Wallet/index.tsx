import { useState, useContext, useEffect, useRef } from "react";
import { AlertModal, AlertRefType, Modal, QRCodeCanvas, SpinningLoader, WalletChart } from "~/components";
import { changeNetwork, getWallet, importWallet, onCopy, openUrl, removeKeysFromLocalStorage, tokenValueFromWei } from "~/functions";
import { goerlyTestNetURL, mainNetURL, USDbalanceOfEth } from "~/utils";
import { COPY_IC, QR_IC, SETTING_BLACK_ICON } from "~/assets";
import { AppContext, resetUser } from "~/context";
import { useOnClickOutside } from "~/hooks";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import Web3 from 'web3';
const { VITE_SWAP_COIN_URL, VITE_BALANCE_STATE_COIN, VITE_STATE_COIN_CONTRACT_ADDRESS, VITE_STATE_COIN_CONTRACT_ABI } = import.meta.env;

const Wallet = () => {
    const { state: { myWallet }, dispatch } = useContext(AppContext);
    // const { state: { myWallet: { wBalances: { ethVal, ethUsd, stateBalance, stateUsd } } } } = useContext(AppContext);
    const web3 = new Web3(myWallet?.isMainNet === true ? mainNetURL : goerlyTestNetURL);

    const [visible, setVisible] = useState(false);
    const onClose = (b: boolean) => setVisible(b);
    const [usingMnemonic, setUsingMnemonic] = useState(true);
    const [mnemonicKey, setMnemonicKey] = useState("");
    const [importing, setImporting] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const onCloseQR = (b: boolean) => setShowQR(b);
    const AlertModalRef = useRef<AlertRefType>(null);
    const [showExport, setShowExport] = useState(false);
    const [showChangeNet, setShowChangeNet] = useState(false);
    const [showSetting, setShowSetting] = useState(false);

    const [stateEthVal, setStateEthVal] = useState<string>("0");
    const [stateEthUsdVal, setStateEthUsdVal] = useState<string>("0");
    const [stateBalance, setStateBalance] = useState<string>("0");
    const [stateUsdVal, setStateUsdVal] = useState<string>("0");
    const stateBalanceUSD = (Number(stateBalance === "" ? "0" : stateBalance || "0") * Number(stateUsdVal === "" ? "0" : stateUsdVal || "0")).toFixed(2);

    const settingRef = useRef(null)

    const onSetting = (v: boolean) => v === !showSetting && setShowSetting(v);

    const hideSetting = () => onSetting(false);
    const onExportWallet = () => { setShowExport(true); onSetting(false); }

    useOnClickOutside(settingRef, hideSetting)

    useEffect(() => {
        async function getUsdVal(address = "") {
            await fetch(`${VITE_BALANCE_STATE_COIN}${address}&vs_currencies=usd`).then((response) => response.json()).then((res) => {
                const dynamicKey = Object.keys(res)[0];
                const usdValue: number = res[dynamicKey]["usd"] || 0;
                setStateUsdVal(usdValue?.toFixed(12)/* ?.replace(/\.?0+$/, "") */);
                getStateBalance();
            });
        };
        async function getStateBalance() {
            const myContract = new web3.eth.Contract(JSON.parse(VITE_STATE_COIN_CONTRACT_ABI), VITE_STATE_COIN_CONTRACT_ADDRESS)
            const balance = await myContract.methods.balanceOf(myWallet.address).call();
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
            const balance = await web3.eth.getBalance(myWallet?.address ?? "");
            const balanceETH = ethers.utils.formatEther(balance);
            setStateEthVal(balanceETH);
            let toUSD = Number(balanceETH === "" ? "0" : balanceETH || "0") * Number(usd);
            setStateEthUsdVal(toUSD.toFixed(2)); // console.log("balanceETH:", balanceETH);
        };

        if ((myWallet?.privateKey === null) || (myWallet?.address === null)) getWallet({ myWallet, dispatch })
        else { myWallet.isMainNet && getUsdVal(String(VITE_STATE_COIN_CONTRACT_ADDRESS)); getETHBalanceUSD(); };
    }, [myWallet?.address, myWallet.isMainNet]);

    const onSel = (to: boolean) => { setMnemonicKey(""); setUsingMnemonic(to); };

    const onImportWallet = () => importWallet({ myWallet, dispatch, mnemonicKey, usingMnemonic, setImporting, setVisible, setMnemonicKey });

    const onNewWallet = () => AlertModalRef.current?.open({ title: "Do you want to add/import new wallet?", subtitle: "Note: you current wallet will logout." });
    const onAddNewWallet = () => {
        AlertModalRef.current?.loadingOn(true);
        setTimeout(async () => {
            await removeKeysFromLocalStorage().finally(() => { AlertModalRef.current?.close(); resetUser(dispatch); });
        }, 200);
    };

    const onChangNet = (isMainNet: boolean) => {
        setShowChangeNet(false);
        changeNetwork(isMainNet, dispatch, myWallet);
    };

    return (
        <div className="flex-row min-h-screen py-20 bg-white min-w-screen font-lato">
            {myWallet?.loadingWallet ? (
                <div className="flex h-[80vh] flex-col w-full items-center justify-center py-9">
                    <SpinningLoader isLoading colClass="text-black" size={10} />
                </div>) : myWallet?.privateKey && myWallet?.address ? (
                    <div className="flex flex-col items-center justify-center flex-1 overflow-y-scroll">
                        <div className="flex w-full px-[10%] mt-[2%] justify-center items-center">
                            <h3 className="text-2xl font-bold text-gray-900">State Wallet</h3>
                            <div ref={settingRef} className="mx-[2%] relative" onClick={() => onSetting(true)}>
                                <button className="transparent-btn " onClick={() => setShowSetting(p => !p)} formTarget="popover-bottom" property="popover-bottom">
                                    <img src={SETTING_BLACK_ICON} alt="copy" className="w-6 h-6 opacity-80" />
                                </button>
                                {showSetting && (
                                    <div data-popover id="popover-bottom" role="tooltip" className="absolute z-40 inline-block w-64 -ml-4 text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-900 shadow-xl -left-24 top-10 rounded-xl ">
                                        <button onClick={onExportWallet} className="flex items-center justify-center w-full px-3 py-2 text-center bg-gray-100 border-b border-gray-300 cursor-pointer select-none rounded-t-xl hover:bg-gray-200">
                                            <h3 className="font-bold text-black font-lato">Export Private Key</h3>
                                        </button>
                                        <button onClick={() => { setShowChangeNet(true); hideSetting(); }} className="flex items-center justify-center w-full px-3 py-2 text-center bg-gray-100 border-t border-gray-300 cursor-pointer select-none rounded-b-xl hover:bg-gray-200">
                                            <h3 className="font-bold text-black font-lato">Change Network</h3>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex w-full px-[10%] mt-[2%] justify-center items-center">
                            <span className="font-lato font-bold text-xl text-center text-gray-500 mx-[2%]">Address</span>
                            <button className="transparent-btn mx-[2%]" onClick={() => onCopy(myWallet?.address)}>
                                <img src={COPY_IC} alt="copy" className="w-6 h-6 opacity-80" />
                            </button>
                            <button className="transparent-btn mr-[2%]" onClick={() => setShowQR(true)}>
                                <img src={QR_IC} alt="copy" className="w-6 h-6 opacity-80" />
                            </button>
                        </div>
                        <p className="my-5 font-mono text-sm text-gray-900 sm:text-base xl:text-lg md:text-lg lg:text-lg">{myWallet?.address}</p>
                        <WalletChart />
                        <div className="container grid grid-cols-1 gap-8 p-6 transition-all duration-200 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">

                            <div className="p-4 bg-black border border-gray-200 shadow-md rounded-xl">
                                <span className="font-lato font-bold text-xl text-center text-white mx-[2%] mb-2">Available Balance</span>
                                <section className="flex flex-col items-center justify-center">
                                    <p className="text-lg font-normal text-white">STATE</p>
                                    <h5 className="text-4xl font-semibold text-white">{stateBalance}</h5>
                                    <p className="inline-flex items-center px-3 text-lg italic text-center text-white font-lato">${stateBalanceUSD}</p>
                                </section>
                            </div>
                            <div className="p-4 bg-black border border-gray-200 shadow-md rounded-xl">
                                <span className="font-lato font-bold text-xl text-center text-white mx-[2%] mb-2">Available Balance</span>
                                <section className="flex flex-col items-center justify-center">
                                    <p className="text-lg font-normal text-white">ETH</p>
                                    <h5 className="text-4xl font-semibold text-white">{stateEthVal}</h5>
                                    {stateEthUsdVal?.toString().length > 0 && (
                                        <p className="inline-flex items-center px-3 text-lg italic text-center text-white font-lato">${stateEthUsdVal}</p>
                                    )}
                                </section>
                            </div>
                        </div>

                        <span className="font-lato font-bold text-xl text-center text-black mx-[2%] mb-[1%]">{stateUsdVal ? `1STATE = $${stateUsdVal}` : ""}</span>
                        <div className="container grid grid-cols-2 gap-8 p-8 transition-all duration-200 border-2 border-black xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 rounded-2xl">
                            {/* <div className="container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 bg-zinc-100 p-4 mt-[2%]"> */}
                            <Link to="/wallet/send-state" className="primary-rounded-btn">
                                <span className="text-lg font-medium text-white font-lato">{"Send STATE"}</span>
                            </Link>
                            <button className="primary-rounded-btn" onClick={() => openUrl(VITE_SWAP_COIN_URL)}>
                                <span className="text-lg font-medium text-white font-lato">{"Swap"}</span>
                            </button>
                            <Link to="/wallet/send-eth" className="primary-rounded-btn">
                                <span className="text-lg font-medium text-white font-lato">{"Send ETH"}</span>
                            </Link>
                            <Link to="/wallet/history" className="primary-rounded-btn">
                                <span className="text-lg font-medium text-white font-lato">{"History"}</span>
                            </Link>
                            <Link to="/wallet/NFT" className="primary-rounded-btn" >
                                <span className="text-lg font-medium text-white font-lato">{"NFT"}</span>
                            </Link>
                            <button className="primary-rounded-btn" onClick={onNewWallet}>
                                <span className="text-lg font-medium text-white font-lato">{"Add New Wallet"}</span>
                            </button>
                        </div>
                    </div>
                ) : (
                <>
                    <div className="flex h-[calc(50vh-5rem)] w-full items-end justify-center py-9">
                        <Link to="/wallet/create" className="primary-btn" >
                            Create Wallet
                        </Link>
                    </div>
                    <div className="flex h-[calc(50vh-5rem)] w-full items-start justify-center py-9">
                        <button className="primary-btn" onClick={() => setVisible(true)}>
                            Import Wallet
                        </button>
                    </div>
                </>
            )}

            {/*--- -:IMPORT WALLET:- ---*/}
            <Modal visible={visible} onClose={onClose} title="Import Wallet" onSave={onImportWallet} saveBtnTxt="Import Wallet" saving={importing}>
                <div className="flex justify-around">
                    <div className="flex items-center mr-4">
                        <input id="mnemonic-radio" type="radio" checked={usingMnemonic} name="inline-radio-group" className="radio-comp" onChange={() => onSel(true)} />
                        <label htmlFor="mnemonic-radio" className="radio-label">Using Mnemonic</label>
                    </div>
                    <div className="flex items-center mr-4">
                        <input id="p-key-radio" type="radio" checked={!usingMnemonic} name="inline-radio-group" className="radio-comp" onChange={() => onSel(false)} />
                        <label htmlFor="p-key-radio" className="radio-label">Using Private key</label>
                    </div>
                </div>

                <div className="my-6">
                    <textarea id="large-input" placeholder={usingMnemonic ? "Enter mnemonic code" : "Enter Private key"} value={mnemonicKey} onChange={(e) => setMnemonicKey(e.target.value)}
                        className="block w-full p-4 font-lato border max-h-[30vh] min-h-[8vh] focus:ring-0 outline-none text-gray-900 border-gray-600 focus:border-gray-900 rounded-2xl bg-white sm:text-md" />
                </div>
            </Modal>

            {/*--- -:QR:- ---*/}
            <Modal visible={showQR} onClose={onCloseQR} title="QR Code" subClass="lg:w-6/12 md:w-7/12 XL:w-5/12 ">
                <div className="flex flex-col items-center justify-center mt-8">
                    <QRCodeCanvas value={myWallet?.address ?? ""} size={180} />
                    <p className="mt-5 text-gray-900 text-md font-lato text-clip">{myWallet?.address}</p>
                </div>
            </Modal>
            {/*--- -:SHOW ALERT:- ---*/}
            <AlertModal ref={AlertModalRef} onConfirm={onAddNewWallet} />
            {/*--- -:EXPORT PRIVATE KEY:- ---*/}
            <Modal visible={showExport} onClose={setShowExport} title="Private Key" onSave={() => { onCopy(myWallet?.privateKey); setShowExport(false) }} saveBtnTxt="Copy" subClass="max-w-[80%] md:max-w-[50%]">
                <h4 className="my-5 text-sm font-bold text-center text-gray-900 break-all sm:text-base xl:text-lg md:text-lg lg:text-lg">{myWallet?.privateKey}</h4>
            </Modal>
            {/*--- -:CHANGE NETWORK:- ---*/}
            <Modal visible={showChangeNet} hideClose onClose={setShowChangeNet} onSave={() => setShowChangeNet(false)} saveBtnTxt="Close" subClass="max-w-[80%] md:max-w-[50%]">
                <button onClick={() => onChangNet(true)} className={`${myWallet.isMainNet ? "bg-black text-white hover:bg-black" : ""} border-b rounded-t-xl change-net-btn`}>
                    <h3 className="text-lg font-bold font-lato ">Ethereum Main Network</h3>
                </button>
                <button onClick={() => onChangNet(false)} className={`${myWallet.isMainNet ? "" : "bg-black text-white hover:bg-black"} border-t rounded-b-xl change-net-btn`}>
                    <h3 className="text-lg font-bold font-lato ">Goerli Test Network</h3>
                </button>
            </Modal>
        </div>
    )
};

export default Wallet;