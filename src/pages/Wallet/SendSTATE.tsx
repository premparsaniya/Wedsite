import { useContext, useEffect, useState } from 'react'
import { AvailableBalanceCard, BTN, Modal, TxtInput } from '~/components';
import { goerlyTestNetURL, mainNetURL } from '~/utils';
import { tokenValueFromWei } from '~/functions';
import { toast } from 'react-toastify';
import { AppContext } from '~/context';
import Web3 from 'web3';
const { VITE_STATE_COIN_CONTRACT_ABI, VITE_STATE_COIN_CONTRACT_ADDRESS } = import.meta.env;

const SendSTATE = () => {
    const { state: { myWallet: { isMainNet, address: myAddress, privateKey } } } = useContext(AppContext);
    const web3 = new Web3(isMainNet === true ? mainNetURL : goerlyTestNetURL);
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [showConform, setShowConform] = useState(false);
    const [gasFeesVal, setGasFeesVal] = useState(0.00);
    const [nonce, setNonce] = useState<number | undefined>();
    const [gasPriceIs, setGasPriceIs] = useState("0");

    const onSend = async () => {
        const myContract = new web3.eth.Contract(JSON.parse(VITE_STATE_COIN_CONTRACT_ABI), VITE_STATE_COIN_CONTRACT_ADDRESS)
        const data = myContract.methods.transfer(address, tokenValueFromWei(amount, '18')).encodeABI();
        let txObj = { from: myAddress || "", to: address, nonce, gas: 21000, gasPrice: gasPriceIs, data }
        privateKey && myAddress && web3.eth.accounts.signTransaction(txObj, privateKey, (err, result) => {
            if (err) { console.error("err:", err); return; }
            console.log("result", result);
            result?.rawTransaction ? web3.eth.sendSignedTransaction(result?.rawTransaction).then(({ transactionHash }) => {
                console.log("transactionHash", transactionHash);
            }).catch((err) => { console.error("err:::", err); }) : console.error(":::_err_:::", err);
        });
    }
    function onConform() {
        if (address?.trim()?.length === 0) { toast.error("Please enter address", { position: "top-center", }); return; };
        if (address?.trim()?.length !== 42) { toast.error("Please enter valid address", { position: "top-center" }); return; };
        if (amount?.trim()?.length === 0) { toast.error("Please enter amount", { position: "top-center" }); return; };
        if (Number(amount) <= 0) { toast.error("Please enter valid amount", { position: "top-center" }); return; };
        setShowConform(true);
    };
    function onClose() { setShowConform(false); };


    useEffect(() => {
        (privateKey || myAddress) === null ? null : (estimatedGasFees(), getNonce())
    }, [myAddress]);

    /* calclute gas fee of amount from web3 */
    // web3.eth.getGasPrice().then(console.log);

    async function getNonce() {
        return myAddress ? await web3.eth.getTransactionCount(myAddress).then((result) => {
            setNonce(result); console.log("nonce", result);
            return result;
        }) : undefined;
    };

    async function estimatedGasFees() {
        return await web3.eth.getGasPrice().then((result) => {
            setGasPriceIs(result); // console.log("resultGASSS", result);
            let gasPrice = web3.utils.fromWei(result, 'ether');
            let gasFees = parseFloat(gasPrice) * 21000;
            console.log("gasFees::::", gasFees);
            setGasFeesVal(gasFees); console.log("gasFees", gasFees);
            return gasFees;
        });
    };

    return (
        <div className="flex flex-col items-center min-h-screen py-20 bg-white min-w-screen px-3.5">
            <AvailableBalanceCard />
            <span className="font-lato font-bold text-xl text-center text-black mx-[2%] mt-[2%] mb-2">Please fill in the form below to send STATE</span>
            <TxtInput
                pHolder="Address"
                val={address}
                onChangeT={setAddress}
            />
            <TxtInput
                pHolder="Amount"
                val={amount}
                onChangeT={t => {
                    if (t === "--" || t === "-" || t === "") {
                        setAmount(""); return;
                    } else {
                        const num = parseFloat(t);
                        if (num < 0) {
                            setAmount(""); return;
                        }
                        setAmount(t);
                    }
                }}
                rLabel="STATE"
                type="number"
                min={0}
            />
            <BTN title="Send STATE" className='mt-8 px-[7%] text-base' onP={onConform} />
            <Modal visible={showConform} onClose={onClose} saveBtnTxt="Send" onSave={onSend} title="Confirm Transaction" subClass="w-[100%] mx-1 sm:mx-10 ">
                <div className="flex justify-between border-t-[1px] border-gray-300 px-4 pt-2">
                    <span className="text-sm text-gray-600 md:text-base">Amount</span>
                    <span className={`block text-[14px] md:text-lg font-lato`}>{amount}</span>
                </div>
                <div className="flex justify-between px-4 pt-2 border-gray-300">
                    <span className="text-sm text-gray-600 md:text-base Estimated gas fee">Estimated gas fee</span>
                    <span className={`block text-[14px] md:text-lg font-lato`}>{gasFeesVal.toFixed(12)}</span>
                </div>
                <div className="flex justify-between px-4 pt-4 border-t-[1px] border-black mt-4">
                    <span className="text-sm text-agray-600 md:text-base">Total</span>
                    <span className={`block text-[14px] md:text-lg font-lato`}>{(parseFloat(amount) + gasFeesVal).toFixed(12)}</span>
                </div>
            </Modal>
        </div>
    )
};

export default SendSTATE;