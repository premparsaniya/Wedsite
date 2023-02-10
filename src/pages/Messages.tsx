import { Fragment, useEffect, useRef, useState } from "react";
import { db, ref, set, onValue, push, child, getStorage, storageRef, uploadString, getDownloadURL, update, orderByKey } from "~/utils";
import { ADD_ICON, BACK_ICON, BLACK_LOGO, CLOSE_ICON, DEF_USER, EMOJI_ICON, MSG_ICON, PLAY_ICON, WHITE_MORE_ICON } from "~/assets";
import { EmojiBoard, Loading, Modal, SpinningLoader, UserListPopup } from "~/components";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { limitToFirst, limitToLast, orderByChild, query } from "firebase/database";
import PostDetails from "~/pages/PostDetails";

function Messages() {
  const storage = getStorage();
  const navigate = useNavigate();
  const { chatroomId } = useParams()
  const { user } = useSelector((state: any) => state.UserLogin);
  const token = user?.token;
  const [chatRoom, setChatRoom] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [handleState, setHandleState] = useState<boolean>(false);
  const [handleUserListPopup, setHandleUserListPopup] = useState<boolean>(false);
  const [chatData, setChatData] = useState<any[]>([]);
  const [msgData, setMsgData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [newUserData, setNewUserData] = useState<any>(null);
  const [textMsg, setTextMsg] = useState<string>("")
  const [uploading, setUploading] = useState<boolean>(false);
  const [reactionPopup, setReactionPopup] = useState<boolean>(false);
  const [reactionId, setReactionId] = useState<string>("")
  // const [reactionTitle, setReactionTitle] = useState<any>("")
  const [editMsgToggle, setEditMsgToggle] = useState<boolean>(false);
  const [editMsgId, setEditMsgId] = useState<string>("")
  const [editReaction, setEditReaction] = useState<any[]>([])
  const [previewClickToggle, setPreviewClickToggle] = useState<boolean>(false);
  const [toggleDetails, setToggleDetails] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<any>(null)
  const [newFileUrl, setNewFileUrl] = useState<any>("")
  const [newThumbnail, setNewThumbnail] = useState<any>("")
  const [newItem, setNewItem] = useState<any>()
  const [fileTypeForN, setFileTypeForN] = useState<string>("")
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");

  const [toggleEmojiBtn, setToggleEmojiBtn] = useState<boolean>(false);

  const msgListRef = ref(db, `messages/${userData?.chatRoomId}`);
  const newMsgRef = push(msgListRef);
  let uniqueId = newMsgRef.key

  const bottomRef = useRef<HTMLDivElement>(null);

  // ------------ for scroll ----------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [msgData]);

  useEffect(() => {
    getChatHistoryData()
  }, [chatroomId]);

  useEffect(() => {
    if (chatroomId) {
      const dbRef = ref(db, `messages/${chatroomId}`);
      onValue(dbRef, (snapshot) => {
        let msgArr: any[] = []
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          msgArr.push(childData)
        });
        // setChildKey(item.chatRoomId)
        setMsgData(msgArr)
      });
    }
  }, [chatroomId])

  // ---------------- send chat push API for generate notification -------------------

  const sendChatPush = () => {
    const obj = {
      method: "send_chat_push",
      chat_message: (fileTypeForN === "" ? textMsg : fileTypeForN),
      receiver_id: userData?.opp_userId,
      sender_user_name: user?.data?.name,
      user_id: user?.data?.user_id,
    };
    fetch(`${import.meta.env.VITE_API_URL}user`, {
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
        if (response.status === 1) {          
        } else {
          // console.log("else", response);
        }
      });
    });
  }
  // ------------ generate unique id ----------------------
  function getUniqueChatId(otherUserId: string) {
    let intUserId = parseInt(user?.data?.user_id)
    let intOtherUserId = parseInt(otherUserId)    
    let result = (intUserId * intOtherUserId)    
    return result.toString()
  }
  // ------------- text input onChange ---------------------
  // const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, emoji?: any) => {
  //   setTextMsg(e.target.value + emoji)
  // };

  const addEmoji = (emoji: any) => {
    setTextMsg(textMsg + emoji);
  };

  // ----------------- file input onChange --------------------

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      const reader = new FileReader();
      // check before / string is video or image in file type
      let isVid = e.target.files[0].type.split("/")[0] === "video"

      const fileType = e?.target?.files[0].type;
      const thumbnail64 = isVid ? (await generateVideoThumbnailBase64(e.target.files[0])) as string : "";
      reader.addEventListener('load', () => {
        sendFile(thumbnail64, reader.result, fileType)
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  // ------------------- generate video base64 thumbnail ---------------
  const generateVideoThumbnailBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");

      // this is important
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        let ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();
        return resolve(canvas.toDataURL("image/jpg"));
      };
    });
  };

  function uploadThumbnail(vidUri: string, thumbBase64: string, fileType: string) {
    const newStorageRef = storageRef(storage, `videos/${uniqueId}.jpeg`);

    uploadString(newStorageRef, thumbBase64, 'data_url').then((snapshot) => {
      getDownloadURL(storageRef(storage, `videos/${uniqueId}.jpeg`))
        .then((url) => {          
          sendMsg(url, vidUri, fileType);
          toast.success("Video uploaded successful", { position: "top-center" });
        })
        .catch((error) => {
          // Handle any errors          
          toast.error("thumbnail error", { position: "top-center" });
        });
    })
  }
  // --------------------- send file function -------------------
  // fileType === "video/mp4" ? thumbnail :
  const sendFile = (thumbBase64: string, img: string | ArrayBuffer | null, fileType: string) => {
    // setFileTypeForN(fileType === "image/jpeg" ? "image" : "video")
    if (img === null) { setUploading(false); return; }
    const newStorageRef = storageRef(storage, fileType === "image/jpeg" ? `images/${uniqueId}.jpeg` : `videos/${uniqueId}.mp4`);

    uploadString(newStorageRef, img as string, 'data_url').then((snapshot) => {

      getDownloadURL(storageRef(storage, fileType === "image/jpeg" ? `images/${uniqueId}.jpeg` : `videos/${uniqueId}.mp4`))
        .then((url) => {          
          // uploadThumbnail(url, thumbBase64, fileType);
          if (fileType === "image/jpeg") {
            sendMsg("", url, fileType); setUploading(false);
            toast.success("Image uploaded successful", { position: "top-center" });
            sendChatPush()
          } else { uploadThumbnail(url, thumbBase64, fileType) };
        })
        .catch((error) => {
          // Handle any errors
          setUploading(false); console.error(error);
          toast.error("Error while uploading file", { position: "top-center" });
        });
    })
  };

  // ---------------- user list popup handle ----------------
  const handleUserList = () => {
    setHandleUserListPopup(!handleUserListPopup)
  }

  // --------------------- go chat click --------------------
  const goChat = (item: any) => {

    let generateId = getUniqueChatId(item?.user_id)
    const msgListRef = ref(db, `chathistory/${user?.data?.user_id}`);
    const newMsgRef = child(msgListRef, generateId);

    onValue(newMsgRef, (snapshot) => {
      if (!snapshot.exists()) {

        let chatHistoryObj = {
          chatHistoryId: generateId,
          chatRoomId: generateId,
          createdAt: `${Date.now().toString()}`,
          last_message: "",
          opp_userChatHistoryId: generateId,
          opp_userId: item?.user_id,
          opp_username: item?.name,
          opp_userprofile: item?.photo,
        }
        set(newMsgRef, chatHistoryObj);

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

      }
    });

    // let chatHistoryObj = {
    //   chatHistoryId: generateId,
    //   chatRoomId: generateId,
    //   createdAt: `${Date.now().toString()}`,
    //   last_message: "" || `${msgData[msgData.length - 1]?.text || msgData[msgData.length - 1]?.messageType}`,
    //   opp_userChatHistoryId: generateId,
    //   opp_userId: item?.user_id,
    //   opp_username: item?.name,
    //   opp_userprofile: item?.photo,
    // }
    // set(newMsgRef, chatHistoryObj);
    // setHandleUserListPopup(false)
    // setChatRoom(false)
    // setHandleState(true);
    // setNewUserData(item)

    // ---------------- opp user set chat history ---------------

    // const oppMsgListRef = ref(db, `chathistory/${item?.user_id}`);
    // const oopNewMsgRef = child(oppMsgListRef, generateId);

    // let oppChatHistoryObj = {
    //   chatHistoryId: generateId,
    //   chatRoomId: generateId,
    //   createdAt: `${Date.now().toString()}`,
    //   last_message: "" || `${msgData[msgData.length - 1]?.text || msgData[msgData.length - 1]?.messageType}`,
    //   opp_userChatHistoryId: generateId,
    //   opp_userId: user?.data?.user_id,
    //   opp_username: user?.data?.name,
    //   opp_userprofile: user?.data?.photo,
    // }
    // set(oopNewMsgRef, oppChatHistoryObj);

    // ----------------- create chat Room --------------------------------

    const chatRoomRef = ref(db, `chatroom/`);
    const newChatRoomRef = child(chatRoomRef, generateId);

    if (chatData.map((item) => item.chatHistoryId !== generateId)) {
      let chatRoomObj = {
        channel_Id: generateId,
        opp_userId: item?.user_id,
        user_id: user?.data?.user_id,
      }
      update(newChatRoomRef, chatRoomObj);
    } else {
      let chatRoomObj = {
        channel_Id: generateId,
        opp_userId: item?.user_id,
        user_id: user?.data?.user_id,
      }
      set(newChatRoomRef, chatRoomObj);
    }

    // -------------------- For get messages ------------------------

    setHandleUserListPopup(false)
    setChatRoom(false)
    setHandleState(true);
    setNewUserData(item)

    const dbRef = ref(db, `messages/${generateId}`);
    onValue(dbRef, (snapshot) => {
      let msgArr: any[] = []
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        msgArr.push(childData)
      });
      setMsgData(msgArr)
    });
    navigate(`/messages/${generateId}`)
  }

  // -------------- get user chat history data ----------

  const getChatHistoryData = () => {
    setLoading(true);
    const dbRef = query(ref(db, `chathistory/${user?.data?.user_id}`), orderByChild("createdAt"));
    onValue(dbRef, (snapshot) => {
      let chatArr: any[] = []
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        chatArr.push(childData)
      });
      // orderByChild(`${user?.data?.user_id}/createdAt`)
      setLoading(false);
      // console.log("chatArr", chatArr)
      setChatData(chatArr.reverse())
      if (chatroomId) {
        let idx = chatArr.findIndex((obj: any) => obj?.chatRoomId === chatroomId);
        setUserData(chatArr[idx])
      }
    },);
  }

  // -------------- chat room open click ---------------

  const handleChatRoom = (item: any) => {
    navigate(`/messages/${item?.chatRoomId}`)
    setUserData(item)
    setChatRoom(false)
    setHandleState(false);
    const dbRef = ref(db, `messages/${item?.chatRoomId}`);
    onValue(dbRef, (snapshot) => {
      let msgArr: any[] = []
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        msgArr.push(childData)
      });
      // setChildKey(item.chatRoomId)
      setMsgData(msgArr)
    });
  }

  // ---------- preview Image and Video click -------------

  const previewClick = (item: any) => {
    setPreviewUrl(item)
    if (item?.chatPostID) {
      setToggleDetails(!toggleDetails)
    } else {
      setPreviewClickToggle(!previewClickToggle)
    }
  }
  // ----------------- edit Msg Toggle ----------------

  const handleEditMsgToggle = (item: any) => {
    setEditMsgId(item?.id)
    setEditReaction(item?.arrReaction)
    setEditMsgToggle(!editMsgToggle)
  }
  // ----------------- reaction Toggle ----------------

  const handleReactionToggle = (item: any) => {
    setReactionId(item?.id)
    setReactionPopup(!reactionPopup)
    setNewItem(item)
  }

  // ------------------- Reaction Click ------------------

  const reactionClick = (reactionName?: string, item?: any) => {
    // console.log("reactionName", reactionName, newItem, userData);
    setReactionPopup(!reactionPopup);

    let oppUserId = userData?.opp_userId;
    let myUserId = user?.data?.user_id;
    let chatRoomId = userData?.chatRoomId;

    // check if reaction array is available or not
    if (newItem?.arrReaction) {
      // find my reaction index & opp reaction index
      let myReactionIdx = newItem?.arrReaction?.findIndex((item: any) => item?.sendBy === myUserId);
      let oppReactionIdx = newItem?.arrReaction?.findIndex((item: any) => item?.sendBy === oppUserId);
      // check if my reaction is available or not
      const reactionRef = ref(db, `messages/${chatRoomId}/${newItem?.id}`);
      if (myReactionIdx !== -1) {
        // if my reaction is available then check if same reaction is there or not
        if (newItem?.arrReaction[myReactionIdx]?.reaction === reactionName) {
          // if same reaction is there then remove my reaction
          update(reactionRef, { arrReaction: [{ reaction: "", sendBy: myUserId }, { reaction: newItem?.arrReaction[oppReactionIdx]?.reaction, sendBy: oppUserId }] });          
        } else {
          // if same reaction is not there then update my reaction
          update(reactionRef, { arrReaction: [{ reaction: reactionName, sendBy: myUserId }, { reaction: newItem?.arrReaction[oppReactionIdx]?.reaction, sendBy: oppUserId }] });          
        }
      } // if my reaction is not available then check if opp reaction is available or not
      else {
        // if opp reaction is available then update opp reaction
        if (oppReactionIdx !== -1) {
          update(reactionRef, { arrReaction: [{ reaction: reactionName, sendBy: myUserId }, { reaction: newItem?.arrReaction[oppReactionIdx]?.reaction, sendBy: oppUserId }] });
        }
        // if opp reaction is not available then add my reaction
        else {
          update(reactionRef, { arrReaction: [{ reaction: reactionName, sendBy: myUserId }, { reaction: "", sendBy: oppUserId }] });
        }
      }
    } else {
      // if reaction array is not available then add reaction
      const reactionRef = ref(db, `messages/${chatRoomId}/${newItem?.id}`);
      update(reactionRef, { arrReaction: [{ reaction: reactionName, sendBy: myUserId }, { reaction: "", sendBy: oppUserId }] });
    }
    return;
  };

  // --------------- send msg ------------------------

  const sendMsg = (thumUrl?: string, fileUrl?: string, fileType?: string) => {
    setFileTypeForN(fileType === "image/jpeg" ? "image" : "video")
    if (editMsgId) {
      const msgListRef = ref(db, `messages/${userData?.chatRoomId}/${editMsgId}`);

      let updatedMsgObj =
        editReaction?.length > 0 ?
          {
            arrReaction: editReaction[1] !== false ? [{ reaction: editReaction[0]?.reaction, sendBy: editReaction[0]?.sendBy }] : [{ reaction: editReaction[0]?.reaction, sendBy: editReaction[0]?.sendBy }, { reaction: editReaction[1]?.reaction, sendBy: editReaction[1]?.sendBy }],
            chatroomId: userData?.chatRoomId,
            createdAt: `${Date.now().toString()}`,
            id: editMsgId,
            messageBy: user?.data?.user_id,
            messageType: "text",
            messagerName: userData?.opp_username,
            text: textMsg,
          } :
          {
            chatroomId: userData?.chatRoomId,
            createdAt: `${Date.now().toString()}`,
            id: editMsgId,
            messageBy: user?.data?.user_id,
            messageType: "text",
            messagerName: userData?.opp_username,
            text: textMsg,
          }

      update(msgListRef, updatedMsgObj);
      setTextMsg("");
      setEditMsgId("");
      setEditReaction([])
    } else {
      let sendMsgObj =
        fileType === "image/jpeg" ?
          {
            // arrReaction: [{ reaction: "", sendBy: "" }],
            chatImageURL: fileUrl,
            chatroomId: userData?.chatRoomId,
            createdAt: `${Date.now().toString()}`,
            id: uniqueId,
            messageBy: user?.data?.user_id,
            messageType: "image",
            messagerName: userData?.opp_username,
            text: "",
          }
          : fileType === "video/mp4" ?
            {
              // arrReaction: [{ reaction: "", sendBy: "" }],              
              chatVideoThumbnail: thumUrl,
              chatVideoURL: fileUrl,
              chatroomId: userData?.chatRoomId,
              createdAt: `${Date.now().toString()}`,
              id: uniqueId,
              messageBy: user?.data?.user_id,
              messageType: "video" || "post",
              messagerName: userData?.opp_username,
              text: "",
            }
            :
            {
              // arrReaction: [{ reaction: "", sendBy: "" }],
              chatroomId: userData?.chatRoomId,
              createdAt: `${Date.now().toString()}`,
              id: uniqueId,
              messageBy: user?.data?.user_id,
              messageType: "text",
              messagerName: userData?.opp_username,
              text: textMsg,
            }
      set(newMsgRef, sendMsgObj);
      setTextMsg("");
      setUploading(false);
    }
    setNewFileUrl(fileUrl)
    setNewThumbnail(thumUrl)
    sendChatPush()

    let generateId = getUniqueChatId(userData?.opp_userId)

    const msgListRef = ref(db, `chathistory/${user?.data?.user_id}`);
    const newChatRef = child(msgListRef, generateId);

    let chatHistoryObj = {
      chatHistoryId: generateId,
      chatRoomId: generateId,
      createdAt: `${Date.now().toString()}`,
      last_message: textMsg || (fileType === "image/jpeg" ? "image" : "video"),
      opp_userChatHistoryId: generateId,
      opp_userId: userData?.opp_userId,
      opp_username: userData?.opp_username,
      opp_userprofile: userData?.opp_userprofile,
    }
    update(newChatRef, chatHistoryObj);

    // setHandleUserListPopup(false)
    // setChatRoom(false)
    // setHandleState(true);
    // setNewUserData(item)

    // ---------------- opp user set chat history ---------------

    const oppMsgListRef = ref(db, `chathistory/${userData?.opp_userId}`);
    const oopNewMsgRef = child(oppMsgListRef, generateId);

    let oppChatHistoryObj = {
      chatHistoryId: generateId,
      chatRoomId: generateId,
      createdAt: `${Date.now().toString()}`,
      last_message: textMsg || (fileType === "image/jpeg" ? "image" : "video"),
      opp_userChatHistoryId: generateId,
      opp_userId: user?.data?.user_id,
      opp_username: user?.data?.name,
      opp_userprofile: user?.data?.photo,
    }
    update(oopNewMsgRef, oppChatHistoryObj);
  }
  // --------------- edit msg ----------------------

  const editMsg = (item?: any) => {
    setEditMsgToggle(!editMsgToggle)
    setTextMsg(item?.text)
  }

  const openEmojiBoard = () => {
    setToggleEmojiBtn(!toggleEmojiBtn)
  }

  const focusHandle = () => {
    setToggleEmojiBtn(false)
  }
  const backBtnClick = () => {
    setChatRoom(!chatRoom)
    navigate("/messages")
    setMsgData([])
  }
  return (
    <section className="flex flex-col pt-14">
      {/* <div className="discover-box"> */}
      {/* <div className="discover-header">Messages</div> */}
      {/* <div className="discover-border__"> */}
      {/* {chatRoom === false ? (
            <div
              className="discover-follow-list-box"
              onClick={() => {
                setChatRoom(true);
              }}
            >
              <div className="discover-follow-list">
                <div className="discover-follow-list-flex">
                  <img src={DEF_USER} alt="Profile" className="profile-size" />
                  <div className="user_name">
                    <span>Mohit Seth</span>
                    <span className="notification-font_">Hiii</span>
                  </div>
                </div>
                <div className="notification-font_">07:12PM</div>
              </div>
            </div>
          ) : (
            <>
              <div className="messages_flex">
                <img
                  src={BACK_ICON}
                  alt="Profile"
                  onClick={() => {
                    setChatRoom(false);
                  }}
                />
                <div className="messages_user_name">
                  <span className="messages_name_text">Mohit Seth</span>
                </div>
              </div>
             
            </>
          )} */}
      <div className="min-w-screen  h-[100%]">
        <div className="min-w-full rounded lg:grid lg:grid-cols-3 ">

          <div
            className={`border-r border-gray-300 lg:col-span-1  ${chatRoom ? "" : " lg:flex xl:flex  sm:hidden md:hidden xs:hidden"
              }`}
          >
            {/* <div className="mx-3 my-3">
              <div className="relative text-gray-600">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 text-gray-300">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </span>
                <input type="search" className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none" name="search" placeholder="Search" required />
              </div>
            </div> */}
            <ul className="overflow-auto min-h-[calc(100vh-60px)] w-full flex flex-col">
              <>
                <div className="w-full my-2 mb-2 flex justify-between items-center " >
                  <h2 className="ml-2 text-lg text-gray-600">Chats</h2>
                  <img src={ADD_ICON} alt="ADD_ICON" className="w-[35px]" onClick={handleUserList} />
                </div>
                {!loading ? (
                  chatData.length > 0 ? (
                    chatData.map((item: any, index: any) => {
                      return (
                        <li key={index} >
                          <span
                            onClick={() => handleChatRoom(item)}
                            className={`${userData?.opp_username === item?.opp_username ? "bg-gray-100" : ""}  flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none`}
                          >
                            <img
                              className="object-cover w-10 h-10 rounded-full"
                              src={item?.opp_userprofile || DEF_USER}
                              alt="username"
                              crossOrigin="anonymous"
                            />
                            <div className="w-full pb-2">
                              <div className="flex justify-between">
                                <span className="block ml-2 font-semibold text-gray-600">
                                  {item?.opp_username}
                                </span>
                                <span className="block ml-2 text-sm text-gray-600">
                                  {moment.unix(item?.createdAt / 1000).format("LT")}
                                </span>
                              </div>
                              <span className="block ml-2 text-sm text-gray-600">
                                {item?.last_message}
                              </span>
                            </div>
                          </span>
                        </li>
                      )
                    })
                  ) : (
                    <div className="no-msg center flex flex-1 justify-center items-center flex-col min-h-full ">
                      <img src={MSG_ICON} alt="msg" />
                      <span className="block text-sm text-gray-600">
                        No Messages
                      </span>
                    </div>
                  )) : <Loading />
                }
              </>
            </ul>
          </div>
          {!chatRoom || chatroomId ? (
            <div className={`${chatRoom ? "lg:flex xl:flex sm:hidden md:hidden xs:hidden" : ""} lg:col-span-2 lg:block`}              >
              <div className="relative w-full mt-2">
                <div className="relative flex items-center px-3 border-b border-gray-300 ">
                  <img src={BACK_ICON} alt="Profile" className="mb-2 block lg:hidden" onClick={backBtnClick} />
                  <img
                    className={`object-cover w-10 h-10 rounded-full mb-2 ml-6 lg:ml-3 ${userData?.opp_userId ? "cursor-pointer" : ""}`}
                    src={(handleState ? newUserData.photo : userData?.opp_userprofile) || DEF_USER}
                    alt="username"
                    onClick={() => userData?.opp_userId && navigate(`/userprofile/${userData?.opp_userId}`)}
                    crossOrigin="anonymous"
                  />
                  <span className="block ml-2 font-bold text-gray-600 mb-2">
                    {handleState ? newUserData?.name : userData?.opp_username}
                  </span>
                </div>
                <div className="relative w-full px-6 overflow-y-auto h-[calc(100vh-12rem)]">
                  <ul className="space-y-2">
                    {/* ============================== VIDEO VIEW ================================== */}
                    {msgData.map((item: any, index: number) => {
                      return (<Fragment key={index} >
                        {
                          (item?.messageType === "post" || item?.messageType === "video" || item?.messageType === "image") ?
                            item?.messageBy !== user?.data?.user_id ?
                              (<li className="flex justify-start relative">
                                <div className={`${(item?.arrReaction && (item?.arrReaction[0]?.reaction !== "" || item?.arrReaction[1]?.reaction !== "")) && "mb-6"} relative max-w-xs text-black bg-gray-100 rounded-t-xl rounded-r-xl min-w-[12rem] min-h-[12rem]  `}> {/* my IMG msg */}
                                  <img
                                    className="block rounded-t-lg h-[200px] w-[200px] object-cover"
                                    crossOrigin="anonymous"
                                    src={item?.chatVideoThumbnail || item?.chatImageURL}
                                    alt="IMG"
                                    onClick={() => previewClick(item)}
                                  />
                                  {item?.messageType === "image" ? null
                                    : (
                                      <img
                                        className="block cursor-pointer rounded-t-lg absolute top-[calc(50%-21px)] left-[calc(50%-21px)]"
                                        src={PLAY_ICON}
                                        alt="IMG"
                                        onClick={() => previewClick(item)}
                                        crossOrigin="anonymous"
                                      />
                                    )}
                                  <div className="flex justify-between align-baseline " >
                                    <span className="text-gray-500 text-xs text-left pl-2 flex justify-center flex-col mr-2 ">
                                      {moment.unix(item?.createdAt / 1000).format("LT")}
                                    </span>
                                    <img src={EMOJI_ICON} alt="EMOJI_ICON" className="w-5 cursor-pointer mr-2 text-white " onClick={() => handleReactionToggle(item)} />
                                  </div>
                                  {reactionPopup && (reactionId === item?.id) &&
                                    <div role="tooltip" className="absolute bottom-5 left-0  z-40 inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border shadow-xl rounded-xl ">
                                      <div className="flex justify-between items-center w-full px-3 text-center bg-gray-100 border-gray-300 cursor-pointer select-none rounded-xl rounded-t-xl ">
                                        <span onClick={() => reactionClick("Thumbs Up", item)} className="font-bold text-black font-lato text-xl mr-2 ">👍</span>
                                        <span onClick={() => reactionClick("Heart", item)} className="font-bold text-black font-lato text-xl mx-2 ">❤️</span>
                                        <span onClick={() => reactionClick("Fire", item)} className="font-bold text-black font-lato text-xl mx-2 ">🔥</span>
                                        <span onClick={() => reactionClick("Claps", item)} className="font-bold text-black font-lato text-xl mx-2 ">👏</span>
                                        <span onClick={() => reactionClick("Tears of Joy", item)} className="font-bold text-black font-lato text-xl ml-2 ">😂</span>
                                      </div>
                                    </div>}
                                  {
                                    item?.arrReaction &&
                                    <div className={`${(item?.arrReaction[0]?.reaction === "") && (item?.arrReaction[1]?.reaction === "") ? "hidden" : ""} px-2 py-0.5 bg-white shadow-xl rounded-xl rounded-t-xl absolute z-10 right-0`}>
                                      {item?.arrReaction[0]?.reaction === "Thumbs Up" && <span>👍</span>}
                                      {item?.arrReaction[0]?.reaction === "Heart" && <span>❤️</span>}
                                      {item?.arrReaction[0]?.reaction === "Fire" && <span>🔥</span>}
                                      {item?.arrReaction[0]?.reaction === "Claps" && <span>👏</span>}
                                      {item?.arrReaction[0]?.reaction === "Tears of Joy" && <span>😂</span>}

                                      {item?.arrReaction[1]?.reaction === "Thumbs Up" && <span>👍</span>}
                                      {item?.arrReaction[1]?.reaction === "Heart" && <span>❤️</span>}
                                      {item?.arrReaction[1]?.reaction === "Fire" && <span>🔥</span>}
                                      {item?.arrReaction[1]?.reaction === "Claps" && <span>👏</span>}
                                      {item?.arrReaction[1]?.reaction === "Tears of Joy" && <span>😂</span>}
                                    </div>
                                  }
                                </div>
                              </li>)
                              :
                              (<li className="flex justify-end ">
                                <div className={`${(item?.arrReaction && (item?.arrReaction[0]?.reaction !== "" || item?.arrReaction[1]?.reaction !== "")) && "mb-6"} relative max-w-xs text-white bg-black min-w-[12rem] min-h-[12rem] rounded-t-xl rounded-l-xl shadow text-right`}> {/* other IMG msg */}
                                  <img
                                    className="block rounded-t-lg h-[200px] w-[200px] object-cover"
                                    crossOrigin="anonymous"
                                    src={item?.chatVideoThumbnail || item?.chatImageURL}
                                    alt="IMG"
                                    onClick={() => previewClick(item)}
                                  />
                                  {item?.messageType === "image" ? null
                                    : <img
                                      className="block cursor-pointer rounded-t-lg absolute top-[calc(50%-21px)] left-[calc(50%-21px)]"
                                      src={PLAY_ICON}
                                      alt="IMG"
                                      onClick={() => previewClick(item)}
                                      crossOrigin="anonymous"
                                    />}
                                  <div className="flex justify-between align-baseline " >
                                    {/* <img src={EMOJI_ICON} alt="EMOJI_ICON" className="w-5 " /> */}
                                    <div onClick={() => handleReactionToggle(item)} >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 text-white cursor-pointer ml-2 "
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                    </div>
                                    <span className="text-white text-xs text-right flex justify-center flex-col mr-2 ">
                                      {moment.unix(item?.createdAt / 1000).format("LT")}
                                    </span>
                                  </div>
                                  {reactionPopup && (reactionId === item?.id) &&
                                    <div role="tooltip" className="absolute bottom-5 left-0 z-40 inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border shadow-xl rounded-xl ">
                                      <div className="flex justify-between items-center w-full px-3 text-center bg-gray-100 border-gray-300 cursor-pointer select-none rounded-xl rounded-t-xl ">
                                        <span onClick={() => reactionClick("Thumbs Up", item)} className="font-bold text-black font-lato text-xl mr-2 ">👍</span>
                                        <span onClick={() => reactionClick("Heart", item)} className="font-bold text-black font-lato text-xl mx-2 ">❤️</span>
                                        <span onClick={() => reactionClick("Fire", item)} className="font-bold text-black font-lato text-xl mx-2 ">🔥</span>
                                        <span onClick={() => reactionClick("Claps", item)} className="font-bold text-black font-lato text-xl mx-2 ">👏</span>
                                        <span onClick={() => reactionClick("Tears of Joy", item)} className="font-bold text-black font-lato text-xl ml-2 ">😂</span>
                                      </div>
                                    </div>}
                                  {
                                    item?.arrReaction &&
                                    <div className={`${(item?.arrReaction[0]?.reaction === "") && (item?.arrReaction[1]?.reaction === "") ? "hidden" : ""} px-2 py-0.5 bg-white shadow-xl rounded-xl rounded-t-xl absolute z-10`}>
                                      {item?.arrReaction[0]?.reaction === "Thumbs Up" && <span>👍</span>}
                                      {item?.arrReaction[0]?.reaction === "Heart" && <span>❤️</span>}
                                      {item?.arrReaction[0]?.reaction === "Fire" && <span>🔥</span>}
                                      {item?.arrReaction[0]?.reaction === "Claps" && <span>👏</span>}
                                      {item?.arrReaction[0]?.reaction === "Tears of Joy" && <span>😂</span>}

                                      {item?.arrReaction[1]?.reaction === "Thumbs Up" && <span>👍</span>}
                                      {item?.arrReaction[1]?.reaction === "Heart" && <span>❤️</span>}
                                      {item?.arrReaction[1]?.reaction === "Fire" && <span>🔥</span>}
                                      {item?.arrReaction[1]?.reaction === "Claps" && <span>👏</span>}
                                      {item?.arrReaction[1]?.reaction === "Tears of Joy" && <span>😂</span>}
                                    </div>
                                  }
                                </div>
                              </li>)
                            : item?.messageBy !== user?.data?.user_id ?
                              (<li className="flex justify-start">
                                <div className={`${(item?.arrReaction && (item?.arrReaction[0]?.reaction !== "" || item?.arrReaction[1]?.reaction !== "")) && "mb-6"} relative max-w-xl px-4 py-2 text-black bg-gray-100 rounded-t-xl rounded-r-xl `}> {/* my txt msg */}
                                  <span className="block">{item?.text}</span>
                                  <div className="flex justify-between align-baseline " >
                                    <span className="text-gray-500 text-xs text-right flex justify-center flex-col mr-3">
                                      {moment.unix(item?.createdAt / 1000).format("LT")}
                                    </span>
                                    <img src={EMOJI_ICON} alt="EMOJI_ICON" className="w-5 cursor-pointer text-gray-500 " onClick={() => handleReactionToggle(item)} />
                                  </div>
                                  {reactionPopup && (reactionId === item?.id) &&
                                    <div role="tooltip" className="absolute bottom-5 left-0  z-40 inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border shadow-xl rounded-xl ">
                                      <div className="flex justify-between items-center w-full px-3 text-center bg-gray-100 border-gray-300 cursor-pointer select-none rounded-xl rounded-t-xl ">
                                        <span onClick={() => reactionClick("Thumbs Up", item)} className="font-bold text-black font-lato text-xl mr-2 ">👍</span>
                                        <span onClick={() => reactionClick("Heart", item)} className="font-bold text-black font-lato text-xl mx-2 ">❤️</span>
                                        <span onClick={() => reactionClick("Fire", item)} className="font-bold text-black font-lato text-xl mx-2 ">🔥</span>
                                        <span onClick={() => reactionClick("Claps", item)} className="font-bold text-black font-lato text-xl mx-2 ">👏</span>
                                        <span onClick={() => reactionClick("Tears of Joy", item)} className="font-bold text-black font-lato text-xl ml-2 ">😂</span>
                                      </div>
                                    </div>}
                                  {item?.arrReaction &&
                                    <div className={`${(item?.arrReaction[0]?.reaction === "") && (item?.arrReaction[1]?.reaction === "") ? "hidden" : ""} px-2 py-0.5 bg-white shadow-xl rounded-xl rounded-t-xl absolute z-10 right-0`} >
                                      {item?.arrReaction[0]?.reaction === "Thumbs Up" && <span>👍</span>}
                                      {item?.arrReaction[0]?.reaction === "Heart" && <span>❤️</span>}
                                      {item?.arrReaction[0]?.reaction === "Fire" && <span>🔥</span>}
                                      {item?.arrReaction[0]?.reaction === "Claps" && <span>👏</span>}
                                      {item?.arrReaction[0]?.reaction === "Tears of Joy" && <span>😂</span>}

                                      {item?.arrReaction[1]?.reaction === "Thumbs Up" && <span>👍</span>}
                                      {item?.arrReaction[1]?.reaction === "Heart" && <span>❤️</span>}
                                      {item?.arrReaction[1]?.reaction === "Fire" && <span>🔥</span>}
                                      {item?.arrReaction[1]?.reaction === "Claps" && <span>👏</span>}
                                      {item?.arrReaction[1]?.reaction === "Tears of Joy" && <span>😂</span>}
                                    </div>
                                  }
                                </div>
                              </li>)
                              :
                              (
                                <>
                                  <li className="flex justify-end">
                                    <div className={`${(item?.arrReaction && (item?.arrReaction[0]?.reaction !== "" || item?.arrReaction[1]?.reaction !== "")) && "mb-6"} relative max-w-xl px-4 py-2 text-white bg-black rounded-t-xl rounded-l-xl shadow text-right`}> {/* my txt msg */}
                                      <div className="flex justify-end " >
                                        <span className="block text-left ">{item?.text}</span>
                                        <img src={WHITE_MORE_ICON} alt="more" className="object-contain h-5 cursor-pointer w-4 ml-2 " onClick={() => handleEditMsgToggle(item)} />
                                      </div>
                                      <div className="flex justify-end align-baseline " >
                                        <div onClick={() => handleReactionToggle(item)} >

                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5 text-white cursor-pointer "
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                          </svg>
                                        </div>
                                        <span className="text-white text-xs text-right flex justify-center flex-col ml-3 ">
                                          {moment.unix(item?.createdAt / 1000).format("LT")}
                                        </span>
                                      </div>
                                      {editMsgToggle && (editMsgId === item?.id) &&
                                        <div role="tooltip" className="absolute top-20px left-0 z-40 inline-block w-32 text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border shadow-xl rounded-xl ">
                                          <button onClick={() => editMsg(item)} className="flex items-center justify-center w-full px-3 py-2 text-center bg-gray-100 cursor-pointer select-none rounded-xl rounded-t-xl hover:bg-gray-200">
                                            <h3 className="font-bold text-black font-lato">Edit</h3>
                                          </button>
                                        </div>}
                                      {reactionPopup && (reactionId === item?.id) &&
                                        <div role="tooltip" className="absolute bottom-5 -left-16 z-40 inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border shadow-xl rounded-xl ">
                                          <div className="flex justify-between items-center w-full px-3 text-center bg-gray-100 border-gray-300 cursor-pointer select-none rounded-xl rounded-t-xl ">
                                            <span onClick={() => reactionClick("Thumbs Up", item)} className="font-bold text-black font-lato text-xl mr-2 ">👍</span>
                                            <span onClick={() => reactionClick("Heart", item)} className="font-bold text-black font-lato text-xl mx-2 ">❤️</span>
                                            <span onClick={() => reactionClick("Fire", item)} className="font-bold text-black font-lato text-xl mx-2 ">🔥</span>
                                            <span onClick={() => reactionClick("Claps", item)} className="font-bold text-black font-lato text-xl mx-2 ">👏</span>
                                            <span onClick={() => reactionClick("Tears of Joy", item)} className="font-bold text-black font-lato text-xl ml-2 ">😂</span>
                                          </div>
                                        </div>}
                                      {
                                        item?.arrReaction &&
                                        <div className={`px-2 py-0.5 ${(item?.arrReaction[0]?.reaction === "") && (item?.arrReaction[1]?.reaction === "") ? "hidden" : ""} bg-white shadow-xl rounded-xl rounded-t-xl absolute z-10`}>
                                          {item?.arrReaction[0]?.reaction === "Thumbs Up" && <span>👍</span>}
                                          {item?.arrReaction[0]?.reaction === "Heart" && <span>❤️</span>}
                                          {item?.arrReaction[0]?.reaction === "Fire" && <span>🔥</span>}
                                          {item?.arrReaction[0]?.reaction === "Claps" && <span>👏</span>}
                                          {item?.arrReaction[0]?.reaction === "Tears of Joy" && <span>😂</span>}

                                          {item?.arrReaction[1]?.reaction === "Thumbs Up" && <span>👍</span>}
                                          {item?.arrReaction[1]?.reaction === "Heart" && <span>❤️</span>}
                                          {item?.arrReaction[1]?.reaction === "Fire" && <span>🔥</span>}
                                          {item?.arrReaction[1]?.reaction === "Claps" && <span>👏</span>}
                                          {item?.arrReaction[1]?.reaction === "Tears of Joy" && <span>😂</span>}
                                        </div>
                                      }
                                    </div>
                                    {/* <div className="relative max-w-xl px-4 py-2 text-white bg-black shadow text-right">
                                    </div> */}
                                  </li>
                                </>
                              )
                        }
                        <div ref={bottomRef} />
                      </Fragment>)
                    })}

                    {/* <li className="flex justify-end">
                        <div className="relative max-w-xl px-4 py-2 text-white bg-black rounded-t-xl rounded-l-xl shadow text-right">
                          <span className="block">Hiiii</span>
                          <span className="text-white text-xs text-right">
                            10:37 AM
                          </span>
                        </div>
                      </li> */}

                    {/* <li className="flex justify-start">
                      <div className="relative max-w-xl px-4 py-2 text-black bg-gray-100 rounded-t-xl rounded-r-xl ">
                        <span className="block">
                          Lorem ipsum dolor sit, amet consectetur adipisicing
                          elit.
                        </span>
                        <span className="text-gray-500 text-xs text-left">
                          10:37 AM
                        </span>
                      </div>
                      </li> */}
                    {/* ============================== IMG VIEW ================================== */}
                    {/* <li className="flex justify-start">
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
                      </li> */}
                    {/* ============================== VIDEO VIEW ================================== */}
                  </ul>
                </div>
                {/* <ChatScreen userData={userData} /> */}
                <div className="relative flex items-center justify-between w-full p-3 border-t border-gray-300">
                  {toggleEmojiBtn && <div className="absolute -top-[450px]" > <EmojiBoard addEmoji={addEmoji} /></div>}
                  <button onClick={openEmojiBoard} >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Message"
                    className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                    name="message"
                    autoComplete="off"
                    required
                    value={textMsg}
                    onChange={(e) => setTextMsg(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { sendMsg() } }}
                    onFocus={focusHandle}
                  />
                  <div className="file-msg cursor-pointer ">
                    <input type={"file"} className="file-msg-input" onChange={handleFileChange} />
                  </div>

                  <button disabled={textMsg === ""} type="submit" onClick={() => sendMsg()} >
                    <svg className="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={
              `${chatRoom ? "lg:flex xl:flex sm:hidden md:hidden xs:hidden" : ""} lg:col-span-2 lg:block justify-center items-center font-semibold flex-col text-lg`
            }>
              <img src={ADD_ICON} alt="ADD_ICON" className="w-12 mt-3 mb-11" onClick={handleUserList} />
              {"Start a conversation"}
              <span className="flex justify-center items-center text-sm mt-4">
                by clicking on the + icon
              </span>
            </div>
          )}
        </div>
      </div>
      {/* ================================================= */}
      {handleUserListPopup && <UserListPopup visible={handleUserListPopup} onClose={setHandleUserListPopup} goChat={goChat} sendMsg={sendMsg} />}
      <Modal subClass=" bg-white rounded-xl shadow-2xl  sm:w-1/5 xs:8/12 mx-0 flex justify-center" visible={uploading} onClose={() => { }} hideClose >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center rounded-full">
            <SpinningLoader
              isLoading
              colClass={`text-black m-auto`}
              size={10}
              className="w-full flex justify-center items-center"
            />
          </div>
          <p className="text-lg font-medium text-gray-500">Uploading...</p>
        </div>
      </Modal>
      {
        previewClickToggle && (
          <div className={"fixed text-black flex items-center justify-center overflow-auto z-40 bg-black bg-opacity-40 left-0 right-0 top-0 bottom-0 transition-all duration-300"}>
            <Modal toggleSpace={true} visible={previewClickToggle} hideClose onClose={setPreviewClickToggle} subClass="w-[100%] mx-1 sm:mx-10 relative min-w-[15rem] min-h-[15rem]">
              {/* <div className={" relative bg-white rounded-xl shadow-2xl py-2 sm:h-4/5 sm:mx-10 sx:h-4/5  xs:w-8/12 mx-10 flex flex-col overflow-hidden "}> */}
              <img
                src={CLOSE_ICON}
                alt="Close"
                className="absolute top-0 right-0 bg-black p-2 rounded-bl-3xl bg-opacity-50 cursor-pointer z-40"
                onClick={() => setPreviewClickToggle(!previewClickToggle)}
              />
              {
                previewUrl?.chatVideoURL ?
                  <video crossOrigin="anonymous" className="object-contain w-full h-full" autoPlay>
                    <source src={previewUrl?.chatVideoURL as string} type="video/mp4" />
                  </video> :
                  <img src={previewUrl?.chatImageURL} alt="video and image" className="object-contain  w-full h-full " />
              }
              {/* </div> */}
            </Modal>
          </div>)
      }
      {toggleDetails && (
        <PostDetails
          key={previewUrl?.chatPostID}
          closeToggle={setToggleDetails}
          chatPostID={previewUrl?.chatPostID}
        />
      )}
    </section >
  );
}
export default Messages;



// private fun mergeVideoAndAudio(videoSource: String, audioSource: String, output: String) {
//   try {
//       val dialogloding = showLoading()
//       val retriever = MediaMetadataRetriever()
//       retriever.setDataSource(videoSource)
//       val width =
//           Integer.valueOf(retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_WIDTH))
//       val height =
//           Integer.valueOf(retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_HEIGHT))
//       retriever.release()

//       val cmd =
//           "-i $videoSource -stream_loop -1 -i $audioSource -shortest -map 0:v:0 -map 1:a:0 -c:v copy -c:a libmp3lame -q:a 1 -y -s $width*$height $output"

// //            FFmpeg.execute(cmd)
//       FFmpeg.executeAsync(cmd) { executionId, returnCode ->
//           when (returnCode) {
//               RETURN_CODE_SUCCESS -> {
//                   dialogloding.dismiss()
//                   videoUrl = output
//                   setDataInResult()
//               }
//               RETURN_CODE_CANCEL -> {
//                   Log.i("VideoPreviewActivity", "Async command execution cancelled by user.");
//               }
//               else -> {
//                   Log.i("VideoPreviewActivity", String.format("Async command execution failed with returnCode=%d.", returnCode));
//               }
//           }
//       }
//   } catch (e: Exception) {
//       e.printStackTrace()
//   }
// }

// -------- my firebase console ------------

// VITE_FIRE_API_KEY = "AIzaSyDZYTMGvFNHDENKPu9V8loN6BN0PENeNUM"
// VITE_FIRE_AUTH_DOM = "chats-fb0df.firebaseapp.com"
// VITE_FIRE_DB_URL = "https://chats-fb0df-default-rtdb.firebaseio.com"
// VITE_FIRE_PRJ_ID = "chats-fb0df"
// VITE_FIRE_STG_BKT = "chats-fb0df.appspot.com"
// VITE_FIRE_MSG_ID = "948794299545"
// VITE_FIRE_APP_ID = "1:948794299545:web:8ae4153496a77676555408"
// VITE_FIRE_MESG_ID = "G-FWW0MN31Y5"

// -------- live console ------------

// VITE_FIRE_API_KEY = "AIzaSyAmUQrwx57wwbgMTeu71CnJg8acp2Sllhk"
// VITE_FIRE_AUTH_DOM = "newworldorder-46319.firebaseapp.com"
// VITE_FIRE_DB_URL = "https://newworldorder-46319-default-rtdb.firebaseio.com"
// VITE_FIRE_PRJ_ID = "newworldorder-46319"
// VITE_FIRE_STG_BKT = "newworldorder-46319.appspot.com"
// VITE_FIRE_MSG_ID = "65383464540"
// VITE_FIRE_APP_ID = "1:65383464540:web:a81a75e6c7b8cb8166b099"
// VITE_FIRE_MESG_ID = "G-QZGJ2KEYYL"