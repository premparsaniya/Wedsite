import { useContext, useEffect, useState } from 'react';
import { getHistory, getTransactionStatus, getWallet, onCopy, tokValFromWeiFormated, openUrl } from '~/functions';
import { Modal, SpinningLoader } from '~/components';
import { RECEIVE_ICON, SENT_ICON } from '~/assets';
import { AppContext } from '~/context';
import moment from 'moment';
import Web3 from 'web3';

const History = () => {
    const { state: { myWallet }, dispatch } = useContext(AppContext);
    const { address, isMainNet, privateKey } = myWallet;
    const [data, setData] = useState<unknown[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [visible, setVisible] = useState(false);
    const onClose = () => setVisible(false);
    const [selectedItm, setSelectedItm] = useState<any>({});

    useEffect(() => {
        (privateKey || address) === null ? getWallet({ myWallet, dispatch }) : onGetHistory();
    }, [address]);

    const onGetHistory = async () => {
        address && getHistory({ wAddress: /* "0x5702f62c9af9af38d10c3f058f7dee1cedfd6352" */address, pg: 1, offset: 1000, isMainNet }).then(({ data, err }) => {
            if (err === null && data?.status === "1") {
                setData(data?.result || []); //console.log("HistoryData", JSON.stringify(data, null, 3));
            } else { console.error(err); }
        }).catch(err => console.error(err)).finally(() => setLoading(false));
    };

    const getStateTxtCol = (st: string) => {
        if (st === "Confirmed") return "text-green-400"
        else if (st === "Failed") return "text-rose-500"
        else if (st === "Pending") return "text-lime-300"
        else return "text-black"
    };

    const getStatus = (st: string) => {
        if (st === "1") return "Confirmed";
        else if (st === "0") return "Failed";
        else if (st === "" || st === null) return "Pending";
        else return "Unknown"
    };

    const onTranstion = (item: any) => {
        setSelectedItm(item); setVisible(true);
        if (isMainNet) {
            getTransactionStatus(item?.hash, isMainNet).then(({ data, err }) => {
                if (err === null && data?.status === "1") {
                    const _data = data?.result || { status: "" };
                    // console.log("TransactionStatus", JSON.stringify(_data, null, 3));
                    setSelectedItm({ ...item, ..._data });
                } else { console.error(err); }
            }).catch(err => console.error(err));
        }
    };


    return (
        <div className="flex flex-col items-center flex-1 min-h-screen py-16 min-w-screen">
            <span className="block text-4xl font-semibold text-center text-black font-lato">History</span>
            {loading ? /* <span className="block text-2xl font-semibold text-center text-black font-lato mt-[15%]">Loading...</span> */
                <SpinningLoader isLoading colClass="text-black" size={10} className="mt-[15%]" /> : (
                    data?.length === 0 ? <span className="block text-lg font-semibold text-center text-black font-lato mt-[15%]">No NFTs found!</span> : (
                        data?.map((item: any, index) => {
                            const _title = `${item?.from === address ? "Sent" : "Received"} ${isMainNet ? item?.tokenSymbol : "ETH"}`;
                            return (
                                <button onClick={() => onTranstion({ ...item, _title })} key={index} className={
                                    `flex flex-row items-center justify-center w-[100%] sm:w-[92%] lg:max-w-[70%] p-1 md:p-4 mx-[4%] ${data?.length - 1 === index ? "" : "border-b-2 border-zinc-100"}`
                                }>
                                    <img src={
                                        item?.from === address ? SENT_ICON : RECEIVE_ICON
                                    } alt="NFT" className="min-w-[50px] h-[50px]" />
                                    <div className="flex flex-col justify-between w-[100%] px-4 min-h-[60px]">
                                        <div className="flex flex-row items-center justify-between w-[100%]">
                                            <span className="block text-[14px] font-semibold text-black lg:text-xl font-lato">{isMainNet ? item?.tokenSymbol ? _title : '--' : _title}</span>
                                            <span className="block text-[14px] font-semibold text-black md:text-xl font-lato">{item?.value ? `${myWallet?.isMainNet ? tokValFromWeiFormated(item?.value, item?.tokenDecimal) : Web3.utils.fromWei(item?.value,/*kether mether gether */ "ether")} ${isMainNet ? item?.tokenSymbol : "ETH"}` : '--'}</span>
                                        </div>
                                        <div className="flex flex-row items-center justify-between w-[100%]">
                                            <span key={index}
                                                className={`block text-[14px] md:text-lg font-lato ${getStateTxtCol(getStatus(isMainNet ? item?.status : item?.txreceipt_status))}`}>{
                                                    isMainNet ? item?.status ? `${getStatus(item?.status)} ` : '--' : item?.txreceipt_status ? `${getStatus(item?.txreceipt_status)} ` : '--'
                                                }</span>
                                            <span className="block text-[14px] md:text-lg text-zinc-700 font-lato">{item?.timeStamp ? moment.unix(item?.timeStamp).fromNow() : "--"}</span>
                                        </div>
                                    </div>
                                </button>
                            )
                        })
                    )
                )
            }

            <Modal visible={visible} onClose={onClose} hideClose saveBtnTxt="Close" onSave={onClose} title={selectedItm?._title} subClass="w-[100%] mx-1 sm:mx-10 ">
                <div className="flex justify-between border-t-[1px] border-gray-300 px-4 pt-4">
                    <span className="text-sm text-gray-600 md:text-base">Status</span>
                    <span className="text-sm text-gray-600 md:text-base">Date</span>
                </div>
                <div className="flex justify-between px-4 pt-2">
                    <span className={`block text-[14px] md:text-lg font-lato ${getStateTxtCol(getStatus(isMainNet ? selectedItm?.status : selectedItm?.txreceipt_status))}`}>{
                        isMainNet ? selectedItm?.status ? `${getStatus(selectedItm?.status)} ` : '--' : selectedItm?.txreceipt_status ? `${getStatus(selectedItm?.txreceipt_status)} ` : '--'
                    }</span>
                    <span className="block text-[14px] md:text-lg font-lato text-black">{selectedItm?.timeStamp ? moment.unix(selectedItm?.timeStamp).format("MMM DD YYYY [at] hh:mm A") : "--"}</span>
                </div>
                <div className="flex justify-between px-4 pt-4 border-t-[1px] border-black mt-4">
                    <span className="text-sm text-gray-600 md:text-base">From</span>
                    <span className="text-sm text-gray-600 md:text-base">To</span>
                </div>
                <div className="flex justify-between px-4">
                    <span
                        className="block text-[14px] md:text-lg font-lato text-black break-all mr-[3%] text-left select-none cursor-copy"
                        onClick={() => onCopy(selectedItm?.from)}
                    >{selectedItm?.from ? selectedItm?.from : '--'}</span>
                    <span
                        className="block text-[14px] md:text-lg font-lato text-black break-all ml-[3%] text-right select-none cursor-copy"
                        onClick={() => onCopy(selectedItm?.to)}
                    >{selectedItm?.to ? selectedItm?.to : '--'}</span>
                </div>
                <div className="flex justify-between px-4 pt-4 border-t-[1px] border-black mt-4">
                    <span className="text-sm text-agray-600 md:text-base">NONCE</span>
                </div>
                <div className="flex justify-between px-4">
                    <span className="block text-[14px] md:text-lg font-lato text-black break-all">{selectedItm?.nonce || '--'}</span>
                </div>
                <div className='self-center'>
                    <button className="transparent-secondary-btn" onClick={() => {
                        openUrl(`https://${myWallet?.isMainNet ? 'etherscan.io' : 'ropsten.etherscan.io'}/tx/${selectedItm?.hash}`)
                    }}>View on EtherScan</button>
                </div>
                <div className="flex justify-between p-3 mt-5 border-2 border-black rounded-xl">
                    <span className="block text-[14px] md:text-lg font-lato text-black break-all">Amount</span>
                    <span className="block text-[14px] md:text-lg font-lato text-black break-all">{
                        selectedItm?.value ? `${myWallet?.isMainNet ? tokValFromWeiFormated(selectedItm?.value, selectedItm?.tokenDecimal) : Web3.utils.fromWei(selectedItm?.value, "ether")} ${isMainNet ? selectedItm?.tokenSymbol : "ETH"}` : '--'
                    }</span>
                </div>
            </Modal>
        </div>
    )
};

export default History;