import { FC, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { App_state, setPostList, LogoutUser, LogoutUserPost, /* setGetPostListToggle */ } from "~/reduxState";
import { AppContext, resetUser } from "~/context";
import {
  BACK_ICON,
  BOOKMARK,
  BOOKMARK_FILL_IC,
  CLOSE_BLACK_ICON,
  CLOSE_ICON,
  COMMENT_ICON,
  HEART_ICON,
  MORE_ICON,
  PAUSE_MUSIC_IC,
  PLAY_MUSIC_IC,
  RED_HEART_ICON,
  SEARCH_ICON,
  SEND_ICON,
  UNLIKE_ICON,
  VOLUME_ICON,
  VOLUME_MUTE_ICON,
} from "~/assets";
import { DEF_USER } from "~/assets";
import { EmojiBoard, Loading, PostDetailContent, SpinningLoader, UserListPopup } from "~/components";
import OptionPopup from "~/components/OptionPopup";
import useDebounce from "~/hooks/useDebounce";
import { toast } from "react-toastify";

type viewType = "" | "like" | "comment" | "share";

interface Props {
  closeBtnTxt?: string;
  saveBtnTxt?: string;
  onSave?: () => void;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  saving?: boolean;
  subClass?: string;
  value?: any;
  closeToggle?: (b: boolean) => void;
  setHandleGP?: (b: boolean) => void;
  chatPostID?: string;
  handleGP?: boolean;
}
type LikeType = "" | "Like" | "UnLike";
const PostDetails: FC<Props> = ({
  className = "",
  subClass = "",
  value,
  closeToggle = () => false,
  setHandleGP = () => false,
  chatPostID,
  handleGP = false,
}) => {
  const [viewStatus, setViewStatus] = useState<viewType>("");

  const { user } = useSelector((state: any) => state.UserLogin);
  const postData = useSelector((s: any) => s?.PostListReducer);
  const postListToggle = useSelector((s: App_state) => s?.GetPostListToggleReducer);
  const { id } = useParams()
  const token = user?.token;
  const { dispatch: disp } = useContext(AppContext);
  const location = useLocation()
  // const value = location?.state?.value

  const [postDetailsData, setPostDetailsData] = useState<any>({});
  const [postCmntData, setPostCmntData] = useState<any[]>([]);
  const [postLikeData, setPostLikeData] = useState<any[]>([]);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [searchResult, setSearchResult] = useState<string>("");
  const [playBool, setPlayBool] = useState<boolean>(false);
  const [soundBool, setSoundBool] = useState<boolean>(false);
  const [postPopup, setPostPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [bmToggle, setBMToggle] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>([]);
  const [sendCToggle, setSendCToggle] = useState<boolean>(false);
  const [likeToggle, setLikeToggle] = useState<string>("0");
  const [likeIconToggle, setLikeIconToggle] = useState<LikeType>("")
  const videoRef = useRef<any>();
  const debounceVal = useDebounce(searchResult, 700);
  const hasNextPage = useRef<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageNoComment, setPageNoComment] = useState<number>(1);
  const [pageNoUser, setPageNoUser] = useState<number>(1);

  const [shareToggle, setShareToggle] = useState<boolean>(false)
  const [toggleEmojiBtn, setToggleEmojiBtn] = useState<boolean>(false);

  const [clicked, setClick] = useState(false);
  const timerRef = useRef<any>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const limit = 10;

  const dataArray =
    viewStatus === "like" || viewStatus === ""
      ? postLikeData
      : viewStatus === "comment"
        ? postCmntData
        : userData;


  useEffect(() => {
    getPostDetails(true);
    postViews()
    // getPostLikes(true);
    // getCommentList(true);
  }, []);

  useEffect(() => {
    getCommentList(false, true);
  }, []);

  useEffect(() => {
    getPostLikes(true, true);
  }, []);

  useEffect(() => {
    getAllUserData();
  }, [debounceVal, pageNoUser]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleVisibilityChange = () => {
    if (document.hidden) {
      videoRef.current.pause();
      setPlayBool(true);
    } else {
      videoRef.current.play();
      setPlayBool(false);
    }
  };

  const getPostDetails = (loadingToggle: boolean) => {
    loadingToggle && setLoading(true);
    const obj = {
      method: "get_post",
      post_id: value?.post_id || chatPostID,
      user_id: user?.data?.user_id,
    };
    fetch(`${import.meta.env.VITE_PUBLIC_URL}post`, {
      method: "POST",
      headers: {
        accept: "application/json",
        contentType: "application/json",
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    })
      .then((res) => {
        res.json().then((response) => {
          if (response.status === 1) {
            setPostDetailsData(response?.data);
            setVideoSrc(response?.data?.attachments[0]?.attachment);
            setLoading(false);
            setLikeToggle(response?.data?.is_liked);
          }
          if (response.status === 2) {
            toast.error("Your session is expired. Please login to access your account", {
              position: "top-center",
            });
            dispatch(LogoutUser());
            dispatch(LogoutUserPost());
            navigate("/");
            resetUser(disp);
          }
        })

      })
      .catch((e) => {
        // console.log("post preview Error ...", e);
      });
  };

  const getCommentList = (loadingToggle: boolean, isRef: boolean = false) => {
    loadingToggle && isRef && setDetailsLoading(true);
    const obj2 = {
      method: "get_post_comments",
      post_id: value?.post_id || chatPostID,
      user_id: user.data.user_id,
      page: isRef ? 1 : pageNoComment,
      limit: limit,
    };
    isRef && setPageNoComment(1);
    fetch(`${import.meta.env.VITE_PUBLIC_URL}post`, {
      method: "POST",
      headers: {
        accept: "application/json",
        contentType: "application/json",
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(obj2),
    })
      .then((res) => {
        res.json().then((response) => {
          if (response.status === 1) {
            setDetailsLoading(false);
            let hasNxt = response?.data?.length >= limit;
            hasNextPage.current = hasNxt;
            setPageNoComment(isRef ? 2 : pageNo + 1);
            if (isRef) {
              setPostCmntData(response?.data);
            } else {
              let clone = [...postCmntData];
              response?.data && clone.push(...response?.data);
              setPostCmntData(clone);
            }
          } else {
            hasNextPage.current = false;
          }
        });
      })
      .catch((e) => {
        console.error("error");
        hasNextPage.current = false;
      });
  };

  const doComment = () => {
    if (comment !== "") {
      setSendCToggle(true);
      setComment("");
      const obj = {
        method: "comment_post",
        post_id: value?.post_id || chatPostID,
        comment: comment,
        user_id: user.data.user_id,
      };
      fetch(`${import.meta.env.VITE_PUBLIC_URL}post`, {
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
            getCommentList(false, true);
            setSendCToggle(false);
            let newPostData = [...postData];
            let idx = newPostData.findIndex(
              (obj: any) => obj?.post_id === value?.post_id
            );
            newPostData[idx] = {
              ...value,
              comments: parseInt(value.comments) + 1,
            };
            dispatch(setPostList(newPostData));
            getPostDetails(false);
          } else {
            setSendCToggle(false);
            toast.error("failed action", {
              autoClose: 100,
              position: "top-center",
            });
          }
        });
      });
    }
  };

  const deleteComment = (commentID: string) => {
    const obj = {
      method: "delete_post_comment",
      post_id: value?.post_id || chatPostID,
      comment_id: commentID,
      user_id: user.data.user_id,
    };
    fetch(`${import.meta.env.VITE_PUBLIC_URL}post`, {
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
          getCommentList(false, true);
          getPostDetails(false);
        }
        if (response.status === 2) {
          toast.error("Your session is expired. Please login to access your account", {
            position: "top-center",
          });
          dispatch(LogoutUser());
          dispatch(LogoutUserPost());
          navigate("/");
          resetUser(disp);
        }
      });
    });
  };

  const getPostLikes = (loadingToggle: boolean, isRef: boolean = false) => {
    loadingToggle && isRef && setDetailsLoading(true);
    const obj = {
      method: "get_post_likes",
      post_id: value?.post_id || chatPostID,
      user_id: user.data.user_id,
      page: isRef ? 1 : pageNo,
      limit: limit,
    };
    isRef && setPageNo(1);
    fetch(`${import.meta.env.VITE_PUBLIC_URL}post`, {
      method: "POST",
      headers: {
        accept: "application/json",
        contentType: "application/json",
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    })
      .then((res) => {
        res.json().then((response) => {
          if (response.status === 1) {
            setDetailsLoading(false);
            let hasNxt = response?.data?.length >= limit;
            hasNextPage.current = hasNxt;
            setPageNo(isRef ? 2 : pageNo + 1);
            if (isRef) {
              setPostLikeData(response?.data);
            } else {
              let clone = [...postLikeData];
              response?.data && clone.push(...response?.data);
              setPostLikeData(clone);
            }
          } else {
            hasNextPage.current = false;
          }
        });
      })
      .catch((e) => {
        console.error("post preview Error ...", e);
        hasNextPage.current = false;
      });
  };

  const doLike = (prev: string, val: any) => {
    setLikeIconToggle(val?.is_liked === "0" ? "Like" : "UnLike")
    setLikeToggle(prev);
    const obj = {
      method: "like_post",
      post_id: value?.post_id || chatPostID,
      user_id: user.data.user_id,
    };

    fetch(`${import.meta.env.VITE_PUBLIC_URL}post`, {
      method: "POST",
      headers: {
        accept: "application/json",
        contentType: "application/json",
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    })
      .then((res) => {
        res.json().then((response) => {
          if (response.status === 1) {
            getPostLikes(true, true);
            let newPostData = [...postData];
            let idx = newPostData.findIndex(
              (obj: any) => obj?.post_id === value?.post_id
            );
            let likeCount = parseInt(val.likes);
            if (val?.is_liked === "0") {
              setLikeIconToggle("")
              newPostData[idx] = {
                ...value,
                is_liked: "1",
                likes: parseInt(val.likes) + 1,
              };
              setPostDetailsData({
                ...postDetailsData,
                is_liked: "1",
                likes: likeCount + 1,
              });
            } else {
              setLikeIconToggle("")
              newPostData[idx] = {
                ...value,
                is_liked: "0",
                likes: parseInt(val.likes) - 1,
              };
              setPostDetailsData({
                ...postDetailsData,
                is_liked: "0",
                likes: likeCount - 1,
              });
            }
            dispatch(setPostList(newPostData));
          } else {
            hasNextPage.current = false;
          }
        });
      })
      .catch((e) => {
        setLikeToggle(prev === "0" ? "1" : "0");
        hasNextPage.current = false;
      });
  };

  const setBookMark = (val: any) => {
    setBMToggle(true);
    const obj = {
      method: "set_bookmark_post",
      post_id: value?.post_id || chatPostID,
      user_id: user?.data?.user_id,
    };
    fetch(`${import.meta.env.VITE_PUBLIC_URL}bookmark`, {
      method: "POST",
      headers: {
        accept: "application/json",
        contentType: "application/json",
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    })
      .then((res) => {
        res.json().then((response) => {
          setBMToggle(false);
          let newPostData = [...postData];
          let idx = newPostData.findIndex(
            (obj: any) => obj?.post_id === value?.post_id
          );
          if (val?.is_bookmarked === "0") {
            newPostData[idx] = {
              ...val,
              is_bookmarked: "1",
              bookmarks: parseInt(val?.bookmarks) + 1,
            };
          } else {
            newPostData[idx] = {
              ...val,
              is_bookmarked: "0",
              bookmarks: parseInt(val?.bookmarks) - 1,
            };
          }
          dispatch(setPostList(newPostData));
          getPostDetails(false);
        });
      })
      .catch((e) => {
        setBMToggle(false);
      });
  };

  const getAllUserData = (isRef: boolean = false) => {
    const obj = {
      method: "get_all_users",
      page: isRef ? 1 : pageNoUser,
      limit: limit,
      search: debounceVal,
    };
    isRef && setPageNoUser(1);
    fetch(`${import.meta.env.VITE_PUBLIC_URL}user`, {
      method: "POST",
      headers: {
        accept: "application/json",
        contentType: "application/json",
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    })
      .then((res) => {
        res.json().then((response) => {
          if (response.status === 1) {
            setDetailsLoading(false);
            let hasNxt = response?.data?.length >= limit;
            hasNextPage.current = hasNxt;
            if (isRef) {
              setUserData(response.data);
            } else {
              let clone = [...userData];
              response?.data && clone.push(...response?.data);
              setUserData(clone);
            }
          } else {
            hasNextPage.current = false;
            // console.log("error");
          }
        });
      })
      .catch((e) => {
        console.error("error");
        hasNextPage.current = false;
      });
  };
  // console.log("user data", userData)
  const sendPostClick = (item: object) => {
    const obj = {
      method: "post_share",
      post_id: value?.post_id || chatPostID,
      user_id: user.data.user_id,
    };

    fetch(`${import.meta.env.VITE_PUBLIC_URL}post`, {
      method: "POST",
      headers: {
        accept: "application/json",
        contentType: "application/json",
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    })
      .then((res) => {
        res.json().then((response) => {
          if (response.status === 1) {
            navigate("/messages", { state: { postData: postDetailsData } });
          } else {
            // console.log("error");
            hasNextPage.current = false;
          }
        });
      })
      .catch((e) => {
        console.error("error");
        hasNextPage.current = false;
      });
  };

  const postViews = () => {
    const obj = {
      method: "post_view",
      post_id: value?.post_id || chatPostID,
      user_id: user.data.user_id,
    };

    fetch(`${import.meta.env.VITE_PUBLIC_URL}post`, {
      method: "POST",
      headers: {
        accept: "application/json",
        contentType: "application/json",
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    })
      .then((res) => {
        res.json().then((response) => {
          if (response.status === 1) {
            let newPostData = [...postData];
            let idx = newPostData.findIndex(
              (obj: any) => obj?.post_id === value?.post_id
            );
            newPostData[idx] = {
              ...value,
              viewed: parseInt(value?.viewed) + 1,
            };
            dispatch(setPostList(newPostData));
          } else {
            // console.log("error");
            hasNextPage.current = false;
          }
        });
      })
      .catch((e) => {
        console.error("error");
        hasNextPage.current = false;
      });
  }

  const handleVideo = () => {
    setClick(true);
    if (clicked) {
      clearTimeout(timerRef.current);
      doLike(value?.is_liked || postDetailsData?.is_liked === "0" ? "1" : "0", postDetailsData)
      setClick(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      if (playBool) {
        videoRef.current?.play();
        setPlayBool(false);
      } else {
        videoRef.current?.pause();
        setPlayBool(true);
      }
      setClick(false);
    }, 250);
  };

  const handleToggleSound = () => {
    videoRef.current?.volume === 1
      ? (videoRef.current.volume = 0)
      : videoRef.current
        ? (videoRef.current.volume = 1)
        : null;
    setSoundBool((prevState) => !prevState);
  };

  const intObserver = useRef<any>();
  const lastPostRef = useCallback(
    (post: any) => {
      if (loading) return;
      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage.current /* && pageOne */) {
          viewStatus === "like" || viewStatus === ""
            ? getPostLikes(true)
            : viewStatus === "comment"
              ? getCommentList(true)
              : getAllUserData();
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [loading, hasNextPage.current, viewStatus]
  );

  const detailsList = useCallback(() => {
    return dataArray?.length > 0
      ? dataArray?.map((item: any, index: number) => {
        return dataArray?.length === index + 1 ? (
          <PostDetailContent
            key={index}
            item={item}
            index={index}
            viewStatus={viewStatus}
            sendPostClick={sendPostClick}
            goProfile={goProfile}
            deleteComment={deleteComment}
            ref={lastPostRef}
          />
        ) : (
          <PostDetailContent
            key={index}
            item={item}
            index={index}
            viewStatus={viewStatus}
            sendPostClick={sendPostClick}
            goProfile={goProfile}
            deleteComment={deleteComment}
          />
        );
      })
      : null;
  }, [dataArray, viewStatus, postCmntData, postLikeData, value]);

  const handlePostPopup = () => {
    setPostPopup(!postPopup);
  };

  const goProfile = (uId: number) => {
    navigate(`/userprofile/${uId}`);
  };
  const closePostDetail = () => {
    // dispatch(setGetPostListToggle(true))
    // navigate(-1);
    closeToggle(false)
  }

  const sharePostToggleClick = () => {
    setShareToggle(!shareToggle)
  }

  const openEmojiBoard = () => {
    setToggleEmojiBtn(!toggleEmojiBtn)
  }

  const focusHandle = () => {
    setToggleEmojiBtn(false)
  }

  const addEmoji = (emoji: any) => {
    setComment(comment + emoji);
  };

  return (
    <>
      {postPopup && (
        <OptionPopup
          value={postDetailsData}
          chatPostID={chatPostID}
          postPopup={postPopup}
          setPostPopup={setPostPopup}
          closeToggle={closeToggle}
          setHandleGP={setHandleGP}
          handleGP={handleGP}
        />
      )}
      <div
        className={
          className +
          "fixed text-black flex items-center justify-center overflow-auto z-40 bg-black bg-opacity-40 left-0 right-0 top-0 bottom-0 transition-all duration-300"
        }
      >
        <div
          className={
            subClass +
            "bg-white  shadow-2xl h-[91%] w-[90%] rounded-lg overflow-hidden"
          }
        >
          <div className="min-w-screen  h-[100%] ">
            {loading ? (
              <div className="w-full h-[100%] flex justify-center items-center">
                <Loading />
              </div>
            ) : (
              <div className="h-full min-w-full rounded lg:grid lg:grid-cols-3">
                <div
                  className={`border-r flex flex-col justify-between border-gray-300 lg:col-span-2 bg-black ${viewStatus === ""
                    ? ""
                    : "lg:flex xl:flex sm:hidden md:hidden xs:hidden"
                    }`}
                >
                  <div className="h-[100%] relative items-center flex-col justify-center flex ">
                    {likeIconToggle !== "" && <img src={likeIconToggle === "Like" ? RED_HEART_ICON : UNLIKE_ICON} alt="RED_HEART_ICON" className="big-like absolute w-20" />}
                    {postDetailsData ? (
                      <>
                        {/* <div className="uap-img"> */}
                        {likeIconToggle === "" ? playBool ? (
                          // {likeIconToggle === "" ? playBool ? (
                          <img
                            src={PLAY_MUSIC_IC}
                            alt="play"
                            className="play-v"
                            onClick={handleVideo}
                          />
                        ) : (
                          // <img
                          //   src={PAUSE_MUSIC_IC}
                          //   alt="pause"
                          //   className="pause-v"
                          //   onClick={handleVideo}
                          // />
                          null
                        ) : null}
                        {!soundBool ? (
                          <img
                            src={VOLUME_ICON}
                            alt="volume"
                            className="on-v"
                            onClick={handleToggleSound}
                          />
                        ) : (
                          <img
                            src={VOLUME_MUTE_ICON}
                            alt="volume"
                            className="off-v"
                            onClick={handleToggleSound}
                          />
                        )}
                        <video
                          preload='auto'
                          loop
                          autoPlay
                          className="h-[86vh] w-full object-contain max-h-[86vh]"
                          ref={videoRef}
                          onClick={handleVideo}
                          onEnded={() => setPlayBool(!playBool)}
                          crossOrigin="anonymous"
                        >
                          <source
                            src={videoSrc}
                            type="video/mp4"
                            className="h-[86vh] w-full object-cover max-h-[86vh]"

                          />
                        </video>
                        {/* </div> */}
                      </>
                    ) : (
                      <>
                        {/* <img src={DefaultImg} alt="img" className="h-[86vh] w-full object-contain max-h-[86vh]" /> */}
                      </>
                    )}
                    <img
                      src={CLOSE_ICON}
                      alt="Close"
                      className="absolute top-0 right-0 p-2 bg-black lg:hidden rounded-bl-3xl bg-opacity-30"
                      onClick={() => {
                        closePostDetail(),
                          setViewStatus("");
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between h-10 bg-white lg:hidden ">
                    <div
                      className="flex items-center justify-center w-full text-center text-white"
                      onClick={() => setViewStatus("like")}
                    >
                      {likeToggle === "1" ? (
                        <img
                          src={RED_HEART_ICON}
                          alt="like"
                          className="cursor-pointer"
                        // onClick={() => doLike("0")}
                        />
                      ) : (
                        <img
                          src={HEART_ICON}
                          alt="like"
                          className="cursor-pointer"
                        // onClick={() => doLike("1")}
                        />
                      )}
                    </div>
                    <div className="border border-black  h-[80%] " />
                    <div
                      className="flex items-center justify-center w-full text-center text-white "
                      onClick={() => setViewStatus("comment")}
                    >
                      <img
                        src={COMMENT_ICON}
                        alt="comment"
                        className="cursor-pointer"
                        onClick={() => setViewStatus("comment")}
                      />
                    </div>
                    <div className="border border-black  h-[80%] mb-1" />
                    <div
                      className="flex items-center justify-center w-full text-center text-white"
                      onClick={() => setViewStatus("share")}
                    >
                      <img
                        src={SEND_ICON}
                        alt="send"
                        className="object-contain h-6 cursor-pointer w-7"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`${viewStatus === "like" ||
                    viewStatus === "share" ||
                    viewStatus === "comment"
                    ? ""
                    : "hidden"
                    } lg:col-span-1 lg:block`}
                >
                  <div className="w-full mt-2">
                    {/* ================================= Header ===================================== */}
                    <div className="flex items-center justify-between  px-6 border-b border-gray-300">
                      <div className="relative flex items-center px-3 ">
                        <img
                          src={BACK_ICON}
                          alt="Profile"
                          className="mb-2 cursor-pointer lg:hidden"
                          onClick={() => {
                            setViewStatus("");
                          }}
                        />
                        <img
                          className="object-cover w-10 h-10 mb-2 ml-6 rounded-full cursor-pointer"
                          src={postDetailsData?.photo || DEF_USER}
                          alt="username"
                          onClick={() => goProfile(value?.user_id || postDetailsData?.user_id)}
                          crossOrigin="anonymous"
                        />
                        <span
                          className="block mb-2 ml-5 font-bold text-gray-600 cursor-pointer"
                          onClick={() => goProfile(value?.user_id || postDetailsData?.user_id)}
                        >
                          {postDetailsData?.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {!chatPostID && <img
                          src={MORE_ICON}
                          alt="more"
                          onClick={handlePostPopup}
                          className="cursor-pointer"
                        />}
                        <img
                          src={CLOSE_BLACK_ICON}
                          alt="Close"
                          className="ml-4 cursor-pointer"
                          onClick={() => {
                            closePostDetail(),
                              setViewStatus("");
                          }}
                        />
                      </div>
                    </div>
                    <div className="px-4 pt-4 mr-6">
                      {viewStatus === "share" && (
                        <div className="discover-search-bar">
                          <img
                            src={SEARCH_ICON}
                            alt="Search"
                            className="navbar__icon mr-2.5 ml-2.5 "
                          />
                          <input
                            className="search-box"
                            placeholder="Search"
                            onChange={(e) => setSearchResult(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    {/* ================================= CapTion ===================================== */}
                    <div
                      className={`w-full px-6 flex relative flex-col overflow-y-auto  ${viewStatus === "comment"
                        ? "h-[calc(100vh-21rem)]"
                        : viewStatus === "like"
                          ? "h-[calc(100vh-15.5rem)]"
                          : viewStatus === "share"
                            ? "h-[calc(100vh-18.5rem)]"
                            : "h-[calc(100vh-15.5rem)]"
                        } mt-2  overflow-auto `}
                    >
                      {viewStatus === "comment" && (
                        <>
                          <div className="relative flex items-center px-3 cursor-pointer">
                            <img
                              className="object-cover w-10 h-10 mb-2 ml-6 rounded-full cursor-pointer"
                              src={postDetailsData?.photo || DEF_USER}
                              alt="username"
                              crossOrigin="anonymous"
                            />
                            <span className="block mb-2 ml-5 font-bold text-gray-600 cursor-pointer">
                              {postDetailsData?.name}
                            </span>
                          </div>
                          <span className="relative flex items-center px-5 break-words cursor-pointer">
                            {postDetailsData?.description}
                          </span>
                        </>
                      )}

                      {/* ================================= Comment List ===================================== */}
                      {detailsLoading ? (
                        <SpinningLoader
                          isLoading
                          className="flex items-center justify-center w-full"
                          colClass="text-black"
                        />
                      ) : (
                        detailsList()
                      )}
                    </div>

                    {/* ====================================================================== */}
                    {viewStatus === "comment" && (
                      <div className="relative flex items-start justify-between w-full px-3 pb-2 border-t border-gray-300 ">
                        {toggleEmojiBtn && <div className="absolute -top-[450px]" > <EmojiBoard addEmoji={addEmoji} /></div>}
                        <button className="mt-3" onClick={openEmojiBoard}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-gray-500"
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
                        </button>

                        <textarea
                          value={comment}
                          placeholder="Message"
                          className="block w-full py-2 pl-4 mx-3 mt-3 bg-gray-100 rounded-lg outline-none focus:text-gray-700 max-h-16"
                          name="message"
                          required
                          onChange={(e) => setComment(e.target.value)}
                          onFocus={focusHandle}
                        />
                        {sendCToggle ? (
                          <SpinningLoader
                            isLoading
                            className="mt-3"
                            colClass="text-black"
                          />
                        ) : (
                          <button
                            type="submit"
                            className="mt-3"
                            onClick={() => doComment()}
                          >
                            <svg
                              className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between px-4 pt-4 pb-2 border-t border-gray-300">
                      <div className="flex items-center">
                        {likeToggle === "1" ? (
                          <img
                            src={RED_HEART_ICON}
                            alt="like"
                            onClick={() => doLike("0", postDetailsData)}
                            className="pr-2 cursor-pointer"
                          />
                        ) : (
                          <img
                            src={HEART_ICON}
                            alt="like"
                            onClick={() => doLike("1", postDetailsData)}
                            className="pr-2 cursor-pointer"
                          />
                        )}
                        <img
                          src={COMMENT_ICON}
                          alt="like"
                          className="pr-2 cursor-pointer"
                          onClick={() => setViewStatus("comment")}
                        />
                        <img
                          src={SEND_ICON}
                          alt="like"
                          className="object-contain h-6 cursor-pointer w-7"
                          onClick={() => sharePostToggleClick()}
                        />
                      </div>
                      <div className="flex items-center">
                        {bmToggle ? (
                          <SpinningLoader
                            isLoading={bmToggle}
                            className="my-0"
                            colClass="text-black"
                          />
                        ) : postDetailsData?.is_bookmarked === "0" ? (
                          <img
                            src={BOOKMARK}
                            alt="like"
                            className="cursor-pointer"
                            onClick={() => setBookMark(value)}
                          />
                        ) : (
                          <img
                            src={BOOKMARK_FILL_IC}
                            alt="like"
                            className="cursor-pointer"
                            onClick={() => setBookMark(value)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="px-4 pb-2">
                      <span
                        onClick={() => setViewStatus("like")}
                        className="cursor-pointer"
                      >
                        {postDetailsData?.likes || 0} likes
                      </span>
                      <span
                        // onClick={() => setViewStatus("like")}
                        className="ml-3 cursor-pointer"
                      >
                        {value?.viewed || 0} views
                      </span>
                      <span
                        className="ml-3 cursor-pointer"
                        onClick={() => setViewStatus("comment")}
                      >
                        {postDetailsData?.comments || 0} comment
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {shareToggle && <UserListPopup visible={shareToggle} onClose={setShareToggle} postValue={value} />}
    </>
  );
};
export default PostDetails;
