import { useState, useEffect, useContext } from "react";
import { createWallet, getWallet, onCopy } from "~/functions";
import { useNavigate } from "react-router-dom";
import { CLOSE_IC, COPY_IC } from "~/assets";
import { AppContext } from "~/context";
import { Modal } from "~/components";

const CreateWallet = () => {
    const { state: { myWallet }, dispatch } = useContext(AppContext);
    const [mnemonic, setMnemonic] = useState("");
    const [phaseType, setPhaseType] = useState(16);
    const [visible, setVisible] = useState(false);
    const [mnemonicArr, setMnemonicArr] = useState<string[]>([]);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [creating, setCreating] = useState(false);
    const nivigate = useNavigate();

    useEffect(() => {
        if ((myWallet?.privateKey || myWallet?.address) === null) {
            getWallet({ myWallet, dispatch, phaseType, net: myWallet.isMainNet, nivigate }).then(({ Hex, HaxRandomArr }) => {
                setMnemonic(Hex); setSelectedWords([]); setMnemonicArr(HaxRandomArr); // create random array of words
            });
        } else nivigate("/wallet", { replace: true });
    }, [phaseType])

    const onWord = (word: string, isRemove: boolean) => {
        if (isRemove) {
            setMnemonicArr([...mnemonicArr, word]);
            setSelectedWords(selectedWords.filter(w => w !== word));
        } else {
            setSelectedWords([...selectedWords, word]);
            setMnemonicArr(mnemonicArr.filter(w => w !== word));
        }
    };

    const onCreateWallet = async () => await createWallet({ mnemonicArr, selectedWords, mnemonic, setCreating, nivigate, dispatch, myWallet, setVisible });

    return (
        <div className="flex flex-col items-center justify-center flex-1 min-h-screen min-w-screen py-14">
            <span className="block text-4xl font-semibold text-center text-black font-lato">Create Wallet</span>
            <div className="flex w-full mt-10 mb-7 px-[10%]">
                <div className="flex items-center justify-center w-1/2">
                    <input id="mnemonic-radio" type="radio" checked={phaseType === 16} name="inline-radio-group" className="radio-comp" onChange={() => setPhaseType(16)} />
                    <label htmlFor="mnemonic-radio" className="text-lg radio-label font-lato">Using 12 Word</label>
                </div>
                <div className="flex items-center justify-center w-1/2">
                    <input id="p-key-radio" type="radio" checked={phaseType === 32} name="inline-radio-group" className="radio-comp" onChange={() => setPhaseType(32)} />
                    <label htmlFor="p-key-radio" className="text-lg radio-label font-lato">Using 24 words</label>
                </div>
            </div>
            <div className="flex w-full px-[10%] mt-[2%] justify-center items-center">
                <span className="font-lato font-bold text-xl text-center text-gray-500 mx-[2%]">Mnemonic Code</span>
                <button className="transparent-btn mx-[2%]" onClick={() => onCopy(mnemonic)}>
                    <img src={COPY_IC} alt="copy" className="w-6 h-6 opacity-80" />
                </button>
            </div>
            <div className="flex flex-row items-center w-full justify-center px-[10%] mt-[1%]">
                <span className="block text-lg font-medium text-black font-lato spey">{mnemonic}</span>
            </div>
            <div className="flex w-full items-start justify-center py-[3%]">
                <button className="primary-btn" onClick={() => setVisible(true)}>
                    Next
                </button>
            </div>

            <Modal visible={visible} onClose={setVisible} title="Confirm Mnemonic Code" saveBtnTxt="Create Wallet" onSave={onCreateWallet} saving={creating}>
                <div className="container m-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 bg-zinc-100 rounded-xl p-4 mt-[2%]">
                    {selectedWords.map((i, idx) => (
                        <div key={idx} className="flex flex-row items-center justify-between tag-div">
                            <span className="text-lg font-medium text-black font-lato">{i}</span>
                            <button className="" onClick={() => onWord(i, true)}>
                                <img src={CLOSE_IC} alt="copy" className="w-4 h-4 opacity-80" onClick={() => onWord(i, true)} />
                            </button>
                        </div>
                    ))}
                </div>
                <p className="font-serif w-full text-center font my-[2%]">Plsease select below words in phrase order.</p>
                <div className="container grid grid-cols-2 gap-4 p-4 m-auto md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 bg-zinc-100 rounded-xl">
                    {mnemonicArr.map((i, idx) => (
                        <button key={idx} className="flex flex-col items-center justify-center tag-btn" onClick={() => onWord(i, false)}>
                            <span className="overflow-hidden text-lg font-medium text-black font-lato text-clip">{i}</span>
                        </button>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default CreateWallet;