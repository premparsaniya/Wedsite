import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LAYERS_IC } from '~/assets';
import { SpinningLoader } from '~/components';
import { AppContext } from '~/context';
import { getFirstKeyVal, getNFTs, getWallet } from '~/functions';

const NFT = () => {
    const { state: { myWallet }, dispatch } = useContext(AppContext);
    const [data, setData] = useState<unknown[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        (myWallet?.privateKey || myWallet?.address) === null ? getWallet({ myWallet, dispatch }) : onGetNFTs();
    }, [myWallet.address]);

    const onGetNFTs = async () => {
        myWallet.address && !loading && setLoading(true);
        myWallet.address && getNFTs(/* "0x5702f62c9af9af38d10c3f058f7dee1cedfd6352" */myWallet.address).then(({ data, err }) => {
            if (err === null) {
                setData(data?.items || []); // console.log("NFTdata", JSON.stringify(data));
            } else { console.error(err); }
        }).finally(() => setLoading(false));
    };

    return (
        <div className="flex flex-col items-center flex-1 min-h-screen py-16 min-w-screen">
            <span className="block text-4xl font-semibold text-center text-black font-lato">NFT</span>
            {loading ? /* <span className="block text-2xl font-semibold text-center text-black font-lato mt-[15%]">Loading...</span> */
                <SpinningLoader isLoading colClass="text-black" size={10} className="mt-[15%]" /> : (
                    data?.length === 0 ? <span className="block text-lg font-semibold text-center text-black font-lato mt-[15%]">No NFTs found!</span> : (
                        data?.map((item: any, index) => {
                            return (
                                <Link to={`/wallet/NFT/${item?.ownership?.id}`} key={index} className={`flex flex-row items-center justify-center w-[92%] lg:max-w-[70%] p-4 mx-[4%] ${data?.length - 1 === index ? "" : "border-b-2 border-zinc-100"}`}>
                                    <img src={getFirstKeyVal(item?.item?.meta?.content || [], "@type", "IMAGE")} alt="NFT" className="min-w-[100px] h-[100px]" />
                                    <div className="flex flex-col justify-between w-[100%] px-4 min-h-[80px]">
                                        <span className="block text-base font-semibold text-black md:text-xl font-lato">{item?.item?.meta?.name || '--'}</span>
                                        <div className="flex flex-row items-center justify-between w-[100%]">
                                            <span className="block text-sm md:text-lg text-zinc-600 font-lato">{`Price: ${item?.item?.bestSellOrder?.makePrice || '--'} ${item?.item?.bestSellOrder?.take?.type?.["@type"] || "--"}`}</span>
                                            <section className="flex flex-row items-center justify-between">
                                                <img src={LAYERS_IC} alt="Layers" className="w-[20px] h-[20px] mr-2" />
                                                <span className="block text-sm md:text-lg text-zinc-700 font-lato">{item?.ownership?.value || "--"}</span>
                                            </section>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    )
                )
            }
        </div>
    )
};

export default NFT;