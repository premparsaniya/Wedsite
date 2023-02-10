import React, { useEffect, useState } from 'react'
import { BLACK_LOGO, PLAY_ICON } from '~/assets'
import { db, ref, set, onValue } from "~/utils";
type Props = {
    userData: any
}
const ChatScreen = ({ userData }: Props) => {

    const [msgData, setMsgData] = useState<any[]>([]);

    const getMsgData = () => {
        const dbRef = ref(db, `messages/${userData?.chatRoomId}`);
        onValue(dbRef, (snapshot) => {
            let msgArr: any[] = []
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                msgArr.push(childData)
            });
            setMsgData(msgArr)
        }, {
            onlyOnce: true
        });
    }    

    useEffect(() => {
        getMsgData()
    }, [])
    return (
        <>
            <div className="relative w-full px-6 overflow-y-auto h-[calc(100vh-12rem)]">
                <ul className="space-y-2">
                    {/* ============================== TEXT VIEW ================================== */}
                    <li className="flex justify-start">
                        <div className="relative max-w-xl px-4 py-2 text-black bg-gray-100 rounded-t-xl rounded-r-xl ">
                            <span className="block">Hi</span>
                            <span className="text-gray-500 text-xs text-left">
                                10:37 AM
                            </span>
                        </div>
                    </li>
                    <li className="flex justify-end">
                        <div className="relative max-w-xl px-4 py-2 text-white bg-black rounded-t-xl rounded-l-xl shadow text-right">
                            <span className="block">Hiiii</span>
                            <span className="text-white text-xs text-right">
                                10:37 AM
                            </span>
                        </div>
                    </li>
                    <li className="flex justify-end">
                        <div className="relative max-w-xl px-4 py-2 text-white bg-black rounded-t-xl rounded-l-xl shadow text-right">
                            <span className="block">how are you?</span>
                            <span className="text-white text-xs text-right">
                                10:37 AM
                            </span>
                        </div>
                    </li>
                    <li className="flex justify-start">
                        <div className="relative max-w-xl px-4 py-2 text-black bg-gray-100 rounded-t-xl rounded-r-xl ">
                            <span className="block">
                                Lorem ipsum dolor sit, amet consectetur adipisicing
                                elit.
                            </span>
                            <span className="text-gray-500 text-xs text-left">
                                10:37 AM
                            </span>
                        </div>
                    </li>
                    {/* ============================== IMG VIEW ================================== */}
                    <li className="flex justify-start">
                        <div className="relative max-w-xs text-black bg-gray-100 rounded-t-xl rounded-r-xl">
                            <img
                                className="block rounded-t-lg"
                                src={BLACK_LOGO}
                                alt="IMG"
                            />
                            <span className="text-gray-500 text-xs text-left pl-2">
                                10:37 AM
                            </span>
                        </div>
                    </li>
                    <li className="flex justify-end">
                        <div className="relative max-w-xs  text-white bg-black rounded-t-xl rounded-l-xl shadow text-right">
                            <img
                                className="block rounded-t-lg"
                                src={BLACK_LOGO}
                                alt="IMG"
                            />
                            <span className="text-white text-xs text-left pr-2">
                                10:37 AM
                            </span>
                        </div>
                    </li>
                    {/* ============================== VIDEO VIEW ================================== */}
                    <li className="flex justify-start">
                        <div className="relative max-w-xs text-black bg-gray-100 rounded-t-xl rounded-r-xl">
                            <img
                                className="block rounded-t-lg"
                                src={BLACK_LOGO}
                                alt="IMG"
                            />
                            <img
                                className="block rounded-t-lg absolute top-[calc(50%-21px)] left-[calc(50%-21px)]"
                                src={PLAY_ICON}
                                alt="IMG"
                            />
                            <span className="text-gray-500 text-xs text-left pl-2">
                                10:37 AM
                            </span>
                        </div>
                    </li>
                    <li className="flex justify-end">
                        <div className="relative max-w-xs  text-white bg-black rounded-t-xl rounded-l-xl shadow text-right">
                            <img
                                className="block rounded-t-lg"
                                src={BLACK_LOGO}
                                alt="IMG"
                            />
                            <img
                                className="block rounded-t-lg absolute top-[calc(50%-21px)] left-[calc(50%-21px)]"
                                src={PLAY_ICON}
                                alt="IMG"
                            />
                            <span className="text-white text-xs text-left pr-2">
                                10:37 AM
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default ChatScreen