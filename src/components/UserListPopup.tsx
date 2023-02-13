import { useSelector } from "react-redux";
import { DEF_USER } from "~/assets";
import UserIcon from "./UserIcon";
import { App_state } from "~/reduxState";
import { useEffect, useState } from "react";
import SpinningLoader from "./Animation/SpinningLoader";
import BTN from "./BTN";
import { toast } from "react-toastify";
import { db, ref, set, onValue, push, child } from "~/utils";

interface Props {
    visible: boolean;
    onClose: (b: boolean) => void;
    closeBtnTxt?: string;
    className?: string;
    subClass?: string;
    value?: any;
    goChat?: (i: any) => void;
    sendMsg?: (thumUrl?: string, fileUrl?: string, fileType?: string) => void;
    postValue?: any,
}

const UserListPopup = ({
    className = "",
    subClass = "",
    onClose,
    goChat = () => { },
    sendMsg = () => { },
    postValue,
}: Props) => {

    const { user } = useSelector((state: App_state) => state?.UserLogin);
    const token = user?.token;

    const [followersData, setFollowersData] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [myLoading, setMyLoading] = useState<boolean>(false);

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        setLoading(true);
        const obj = {
            method: "get_followers",
            user_id: user.data.user_id,
        };

        fetch(`${import.meta.env.VITE_PUBLIC_URL}profile`, {
            method: "POST",
            headers: {
                accept: "application/json",
                contentType: "application/json",
                version: "1.0.0",
                token: `Bearer ${token}`,
            },
            body: JSON.stringify(obj),
        }).then((res) => {
            res.json().then((response) => {
                if (response.status === 1 && response?.data?.followers !== null) {
                    setFollowersData(response?.data?.followers)
                }
                setLoading(false);
            })
        })
    };

    function getUniqueChatId(otherUserId: string) {
        let intUserId = parseInt(user?.data?.user_id)
        let intOtherUserId = parseInt(otherUserId)
        let kb = intUserId + intOtherUserId
        let result = ((1 / 2) * kb * (kb + 1)) + (intUserId * intOtherUserId)
        return result.toString()
    }

    const sendPost = (item: any) => {

        let generateId = getUniqueChatId(item?.user_id)
        const chatHRef = ref(db, `chathistory/${user?.data?.user_id}`);
        const newChatHRef = child(chatHRef, generateId);

        let chatHistoryObj = {
            chatHistoryId: generateId,
            chatRoomId: generateId,
            createdAt: `${Date.now().toString()}`,
            last_message: "post",
            opp_userChatHistoryId: generateId,
            opp_userId: item?.user_id,
            opp_username: item?.name,
            opp_userprofile: item?.photo,
        }
        set(newChatHRef, chatHistoryObj);

        // ---------------- opp user set chat history ---------------

        const oppMsgListRef = ref(db, `chathistory/${item?.user_id}`);
        const oopNewMsgRef = child(oppMsgListRef, generateId);

        let oppChatHistoryObj = {
            chatHistoryId: generateId,
            chatRoomId: generateId,
            createdAt: `${Date.now().toString()}`,
            last_message: "",
            opp_userChatHistoryId: generateId,
            opp_userId: user?.data?.user_id,
            opp_username: user?.data?.name,
            opp_userprofile: user?.data?.photo,
        }
        set(oopNewMsgRef, oppChatHistoryObj);

        const dbRef = ref(db, `messages/${generateId}`);
        onValue(dbRef, (snapshot) => {
            let msgArr: any[] = []
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                msgArr.push(childData)
            });
        });

        // --------------- create chat room ----------------------
        
        const chatRoomRef = ref(db, `chatroom/`);
        const newChatRoomRef = child(chatRoomRef, generateId);

        let chatRoomObj = {
          channel_Id: generateId,
          opp_userId: item?.user_id,
          user_id: user?.data?.user_id,
        }
        set(newChatRoomRef, chatRoomObj);

        // -------------- send message function ---------------

        const msgListRef = ref(db, `messages/${generateId}`);
        const newMsgRef = push(msgListRef);
        let uniqueId = newMsgRef.key

        let sendMsgObj = {
            // arrReaction: [{ reaction: "", sendBy: "" }],
            chatPostID: postValue?.post_id,
            chatVideoThumbnail: postValue?.att_thumb,
            chatVideoURL: postValue?.attachment,
            chatroomId: uniqueId,
            createdAt: `${Date.now().toString()}`,
            id: uniqueId,
            messageBy: user?.data?.user_id,
            messageType: "post",
            messagerName: item?.name,
            text: "",
        }
        set(newMsgRef, sendMsgObj);
        // console.log("newMsgRef", newMsgRef)
        onClose(false);
    }

    // console.log("postValue", postValue)
    return (
        <>
            <div
                className={
                    className +
                    "fixed text-black flex items-center justify-center overflow-auto z-40 bg-black bg-opacity-40 left-0 right-0 top-0 bottom-0 transition-all duration-300"
                }
            >
                <div
                    className={
                        subClass +
                        " bg-white rounded-xl shadow-2xl p-2 sm:h-2/4 sx:h-2/4 sm:w-2/4 xs:w-8/12 mx-10 flex flex-col "
                    }
                >
                    <div className={subClass + "rounded-xl sm:h-5/6 sx:h-5/6 flex flex-col overflow-scroll "}>
                        {followersData?.length > 0 ? followersData?.map((item: any, index: number) => {
                            return (
                                <div className="followers-component cursor-crosshair w-full" key={index}  >
                                    <div
                                        className="followers-row1"
                                        onClick={() => !postValue && goChat(item)}
                                    >
                                        <span style={{ padding: "0px 10px 0px 0px" }}   >
                                            {" "}
                                            <UserIcon
                                                src={item?.photo}
                                                popups={undefined}
                                                popupval={undefined}
                                                setPopupLike={undefined}
                                                popupLike={undefined}
                                                setPopupExplore={undefined}
                                            />
                                        </span>
                                        <span style={{ padding: "0px 10px 0px 5px" }}>{item?.name}</span>
                                    </div>
                                    {/* <BTN
                                        className="px-5"
                                        onP={sendPost}
                                        loading={myLoading}
                                        title="Send"
                                        disabled={
                                            myLoading
                                                ? false
                                                : true
                                        }
                                    /> */}
                                    {
                                        postValue &&
                                        <button onClick={() => sendPost(item)} className="rounded-xl bg-black text-white cursor-pointer w-20 h-10" >
                                            Send
                                        </button>
                                    }
                                </div>)
                        }) : !loading && (
                            <div className="flex flex-col items-center justify-center min-h-full">
                                <p className="text-center mt-4">No Followers</p>
                            </div>
                        )}
                        {loading && (
                            <SpinningLoader
                                isLoading
                                colClass={`text-black ${followersData?.length === 0 ? "mt-40" : ""}`}
                                size={10}
                                className="mb-4 w-full flex justify-center items-center"
                            />
                        )}
                    </div>
                    <div className="flex mt-6  items-center justify-center">
                        <button
                            onClick={() => onClose(false)}
                            className="secondary-btn hover:text-white hover:bg-black w-[60%] px-5"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserListPopup