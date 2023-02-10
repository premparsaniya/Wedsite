import { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LAYERS_IC } from '~/assets';
import { Loading } from '~/components';
import { AppContext } from '~/context';
import { getFirstKeyVal, getNFT, getOwnship, getWallet } from '~/functions';

const NFTDetails = () => {
    const { id } = useParams();
    console.log("NFTDetails", id);

    const { state: { myWallet }, dispatch } = useContext(AppContext);
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [ownershipIdNFT, setOwnershipIdNFT] = useState<{ ownershipId: string, nftId: string }>({ ownershipId: "", nftId: "" });
    const [ownershipData, setOwnershipData] = useState<any>({});

    useEffect(() => {
        (myWallet?.privateKey || myWallet?.address) === null ? getWallet({ myWallet, dispatch }) : onGetNFT();
    }, [id, myWallet?.privateKey]);

    const onGetNFT = async () => {
        id && !loading && setLoading(true);
        if (!id) return;
        const { nftId, ownershipId } = extractFromOwnerShipId(id);
        getNFT(nftId).then(async ({ data, err }) => {
            if (err === null) {
                setData(data);// console.log("NFTdataById", JSON.stringify(data));
                await getOwnship(ownershipId).then(({ data: oData, err }) => {
                    if (err === null) {
                        setOwnershipData(oData); console.log("OwnershipData", JSON.stringify(oData));
                    } else { console.error(err); }
                }).finally(() => setLoading(false));
            } else { console.error(err); }
        }).finally(() => setLoading(false));
    };

    // extract the NFT id from the ownerShipIdNFT
    const extractFromOwnerShipId = (ownershipIdNFT: string) => {
        // return ownershipId & nftId in object
        let ownershipId = ownershipIdNFT;
        let nftId = ownershipIdNFT?.split(":")?.slice(0, 4)?.join(":");
        return { ownershipId, nftId };
    }


    return (
        <section className="overflow-hidden text-gray-700 bg-white body-font">
            {loading ? <div className="flex flex-row items-center justify-center w-[100%] h-[100vh]">
                <div className="flex flex-col items-center justify-center">
                    <Loading />
                </div>
            </div> : <div className="container px-5 sm-px-1 xs:px-1 md:px-[5%] py-16 mx-auto">
                <span className="block text-3xl font-semibold text-center text-black font-lato">NFT Details</span>
                <div className="flex flex-wrap mx-auto lg:w-12/12 ">{/* items-center */}
                    {/* <video className="object-contain w-full lg:w-1/2 max-w-min" src="https://dummyimage.com/700x400" /> */}
                    {/* {getFirstKeyVal(data?.item?.meta?.content || [], "@type") && ( */}
                    <video
                        autoPlay
                        className="lg:w-1/2 w-full object-cover max-w-min aspect-[39/22] max-h-[80vh] lg:mt-7"
                        loop
                        muted
                        controls={false}
                        key={getFirstKeyVal(data?.meta?.content || [], "@type", "VIDEO")}
                    // ref={videoRef}
                    // onClick={handleVideo}
                    // onEnded={() => setPlayBool(!playBool)}
                    >
                        <source
                            src={getFirstKeyVal(data?.meta?.content || [], "@type", "VIDEO")}
                            type="video/mp4"
                            className="h-[86vh] w-full object-cover max-h-[86vh]"
                        />
                    </video>
                    {/* )} */}
                    <div className="w-full mt-6 lg:w-1/2 lg:pl-10 lg:py-6 lg:mt-0">
                        <div className={`flex flex-row items-center justify-center w-[100%] border-b-2 border-zinc-100 pb-4 mb-4`}>
                            <div className="flex flex-col justify-between w-[100%] pr-4 min-h-[100px]">
                                <span className="block text-base font-semibold text-black md:text-2xl font-lato">{data?.meta?.name || '--'}</span>
                                <div className="flex flex-row items-center w-[100%]">
                                    <span className="block text-sm font-medium md:text-lg lg:text-xl text-zinc-600 font-lato">{`Price: ${data?.bestSellOrder?.makePrice || '--'} ${data?.bestSellOrder?.take?.type?.["@type"] || "--"}`}</span>
                                    <section className="flex flex-row items-center ml-[2%]">
                                        <img src={LAYERS_IC} alt="Layers" className="w-[20px] h-[20px] mr-2" />
                                        <span className="block text-sm md:text-lg lg:text-xl text-zinc-700 font-lato">{ownershipData?.value || "--"}</span>
                                    </section>
                                </div>
                            </div>
                            <img src={getFirstKeyVal(data?.meta?.content || [], "@type", "IMAGE")} alt="NFT" className="min-w-[100px] h-[100px]" />
                        </div>
                        <span className="block text-base font-semibold text-black md:text-2xl font-lato">{"Details"}</span>
                        <span className="block mt-3 text-sm font-semibold text-black md:text-lg lg:text-xl font-lato">{"Contact Address"}</span>
                        <span className="block text-xs font-medium break-all md:text-lg lg:text-xl text-zinc-600 font-lato">{data?.contract ? data?.contract?.split(":")?.slice(1)?.join(":") : "--"}</span>
                        <span className="block mt-3 text-sm font-semibold text-black md:text-lg lg:text-xl font-lato">{"Token Id"}</span>
                        <span className="block text-xs font-medium break-all md:text-lg lg:text-xl text-zinc-600 font-lato">{data?.tokenId || "--"}</span>
                        <span className="block mt-3 text-sm font-semibold text-black md:text-lg lg:text-xl font-lato">{"Blockchain"}</span>
                        <span className="block text-xs font-medium break-all md:text-lg lg:text-xl text-zinc-600 font-lato">{data?.blockchain || "--"}</span>
                        <span className="block mt-3 text-sm font-semibold text-black md:text-lg lg:text-xl font-lato">{"Description"}</span>
                        <pre className="block mt-2 text-xs font-medium break-all whitespace-pre-wrap md:text-lg lg:text-xl text-zinc-600 font-lato">{data?.meta?.description || "--"}</pre>
                    </div>
                </div>
            </div>}
        </section>
    )
};

export default NFTDetails;