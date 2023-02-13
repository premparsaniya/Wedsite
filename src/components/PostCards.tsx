import { Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserIcon from "./UserIcon";
import OptionPopup from "./OptionPopup";
import PostDetails from "~/pages/PostDetails";
import SpinningLoader from "./Animation/SpinningLoader";
import {
  BOOKMARK,
  BOOKMARK_FILL_IC,
  COMMENT_ICON,
  DEFAULT_IMG,
  EYE_ICON,
  HEART_ICON,
  MORE_ICON,
  RED_HEART_ICON,
  SEND_ICON,
  UNLIKE_ICON,
} from "~/assets";
import { App_state, setPostList } from "../reduxState";
import UserListPopup from "./UserListPopup";
// import { SharePopup } from "~/pages";

type Props = {
  val: any;
  index: number;
  getPostList: () => void;
};

type LikeType = "" | "Like" | "UnLike";

const PostCards = ({ val, index, getPostList }: Props) => {
  const { user } = useSelector((state: any) => state.UserLogin);
  const dispatch = useDispatch();
  // const [like, setLike] = useState(false);
  // const [playBool, setPlayBool] = useState<boolean>(false);
  // const [soundBool, setSoundBool] = useState<boolean>(false);
  const [postPopup, setPostPopup] = useState<boolean>(false);
  // const [message, setMessage] = useState<string>("");
  const [bmToggle, setBMToggle] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [toggleDetails, setToggleDetails] = useState<boolean>(false);
  const [visibleShare, setVisibleShare] = useState<boolean>(false);
  const [sharePostValue, setSharePostValue] = useState<any>(null)

  const [likeToggle, setLikeToggle] = useState<LikeType>("")
  // var videoRef = useRef<HTMLVideoElement>(null);

  const postData = useSelector((s: App_state) => s?.PostListReducer);

  const [clicked, setClick] = useState(false);
  const timerRef = useRef<any>(null);

  const navigate = useNavigate();

  const token = user?.token;

  const goProfile = () => {
    navigate(`/userprofile/${val?.user_id}`);
  };

  const likePost = (value: any, key: number) => {
    setLikeToggle(value?.is_liked === "0" ? "Like" : "UnLike")
    const obj = {
      method: "like_post",
      post_id: val?.post_id,
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
            let newPostData = [...postData];
            if (value?.is_liked === "0") {
              setLikeToggle("")
              // setUnLikeToggle(false)
              newPostData[key] = {
                ...value,
                is_liked: "1",
                likes: parseInt(value.likes) + 1,
              };
            } else {
              // setUnLikeToggle("UnLike")
              setLikeToggle("")
              newPostData[key] = {
                ...value,
                is_liked: "0",
                likes: parseInt(value.likes) - 1,
              };
            }
            dispatch(setPostList(newPostData));
          }
        });
      })
      .catch(() => {
        // console.log("Like Network issue...");
      });
  };
  // const showPost = () => {
  //   navigate(`/uapp/${val?.post_id}`);
  // };

  //----------------------------------------

  const handleClick = () => {
    setClick(true);
    if (clicked) {
      clearTimeout(timerRef.current);
      likePost(val, index);
      setClick(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      // navigate(`/postdetails/${val?.post_id}`, { state: { value: val } })
      setVisible(!visible);
      setToggleDetails(!toggleDetails);
      setClick(false);
    }, 250);
  };
  //-------------------------------------------

  const setBookMark = (value: any, key: number) => {
    setBMToggle(true);
    const obj = {
      method: "set_bookmark_post",
      // action: "",
      post_id: val?.post_id,
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

          // if (value?.is_bookmarked === "0") {
          //   newPostData[key] = {
          //     ...value,
          //     is_bookmarked: "1",
          //   };
          // } else {
          //   newPostData[key] = {
          //     ...value,
          //     is_bookmarked: "0",
          //   };
          // }
          // dispatch(setPostList(newPostData))

          // let newPostData = [...postData];
          if (response?.status === 1) {
            setBMToggle(false);
            let newPostData = [...postData];
            if (value?.is_bookmarked === "0") {
              newPostData[key] = {
                ...value,
                is_bookmarked: "1",
                bookmarks: parseInt(value.bookmarks) + 1,
              };
            } else {
              newPostData[key] = {
                ...value,
                is_bookmarked: "0",
                bookmarks: parseInt(value.bookmarks) - 1,
              };
            }
            dispatch(setPostList(newPostData));
          }
        });
      })
      .catch((e) => {
        setBMToggle(false);
        // console.log("post preview Error ...", e);
      });
  };

  // const handleVideo = () => {
  //   if (playBool) {
  //     videoRef.current?.pause()
  //     setPlayBool(false)

  //   } else {
  //     videoRef.current?.play()
  //     setPlayBool(true)

  //   }
  // }

  // const handleToggleSound = () => {
  //   videoRef.current?.volume === 1 ? videoRef.current.volume = 0 : videoRef.current ? videoRef.current.volume = 1 : null;
  //   setSoundBool(prevState => !prevState)

  // }

  const handlePostPopup = () => {
    setPostPopup(!postPopup);
  };

  const handleSharePopup = (pVal: any) => {
    setVisibleShare(!visibleShare)
    setSharePostValue(pVal)
  }

  return (
    <Fragment key={index}>
      {postPopup && (
        <OptionPopup
          value={val}
          // onClose={() => setPostPopup(!postPopup)}
          postPopup={postPopup}
          setPostPopup={setPostPopup}
        />
      )}

      <div className="home-userpro">
        <div className="home-pro-icon d-f" onClick={() => goProfile()}>
          <UserIcon
            src={val?.photo}
            popups={undefined}
            popupval={undefined}
            setPopupLike={undefined}
            popupLike={undefined}
            setPopupExplore={undefined}
          />
        </div>
        <div className="home-user-nm ">
          <p onClick={() => goProfile()}>{val?.name} </p>
        </div>
        <div className="home-user-info d-f">
          <img
            src={MORE_ICON}
            alt="more"
            style={{ cursor: "pointer" }}
            onClick={handlePostPopup}
          />
        </div>
      </div>
      <div className="home-img">
        {likeToggle !== "" && <img src={likeToggle === "Like" ? RED_HEART_ICON : UNLIKE_ICON} alt="RED_HEART_ICON" className="big-like absolute w-20" />}
        <img
          src={val?.att_thumb || DEFAULT_IMG }
          className="post-img"
          crossOrigin="anonymous"
          onClick={() => handleClick()}
          alt="post"
          style={{ width: "100%", height: "100%", minHeight: "150px" }}
        />
        {/* <NetworkImage nameOfImage="post" networkImageUrl={"val.att_thumb"} /> */}
        {/* {

          !playBool ?
            <>
              <BsFillPlayCircleFill className="play-v" onClick={handleVideo} />
            </>
            :
            <>
              <BsPauseCircleFill className="pause-v" onClick={handleVideo} />
            </>
        }
        {
          !soundBool ?
            <HiVolumeUp className="on-v" onClick={handleToggleSound} />
            :
            <HiVolumeOff className="off-v" onClick={handleToggleSound} />
        } */}
        {/* <video width="100%" height="100%" className="post-img" 
        ref={videoRef} onClick={handleVideo} onEnded={() => (setPlayBool(false))}  
        onClick={() => showPost()}
        > */}
        {/* <source src={val.att_thumb} type="video/mp4" />
        </video> */}
      </div>
      <div
        className="home-comm-section"
      /* onClick={() => {
  setVisible(!visible);
}} */
      >
        <div className="home-post-like">
          {val?.is_liked === "1" ? (
            <img
              src={RED_HEART_ICON}
              alt="like"
              className="ic mr-2.5 my-2.5"
              style={{ fontSize: "1.7rem", cursor: "pointer" }}
              onClick={() => likePost(val, index)}
            />
          ) : (
            <img
              src={HEART_ICON}
              alt="like"
              className="ic mr-2.5 my-2.5"
              style={{ fontSize: "1.7rem", cursor: "pointer" }}
              onClick={() => likePost(val, index)}
            />
          )}
          <img
            src={COMMENT_ICON}
            className="my-2 mr-2 cursor-pointer ic"
            alt="comment"
            onClick={() => handleClick()}
          />
          {/* </div> */}
          <img
            src={SEND_ICON}
            alt="send"
            className="object-contain h-6 my-2 mr-2 cursor-pointer w-7"
            onClick={() => handleSharePopup(val)}
          />
          <img
            src={EYE_ICON}
            alt="send"
            className="object-contain h-6 cursor-pointer w-7"
          />
        </div>
        <div className="home-post-bk">
          {bmToggle ? (
            <SpinningLoader
              isLoading={bmToggle}
              className="ic my-0"
              colClass="text-black"
            />
          ) : val?.is_bookmarked === "0" ? (
            <img
              src={BOOKMARK}
              alt="bookmark"
              className="ic my-2.5 cursor-pointer"
              onClick={() => setBookMark(val, index)}
            />
          ) : (
            <img
              src={BOOKMARK_FILL_IC}
              alt="bookmark"
              className="ic my-2.5 cursor-pointer"
              onClick={() => setBookMark(val, index)}
            />
          )}
        </div>
      </div>
      <div className="home-post-comment ">
        <div className="d">
          {val.is_liked === "1" ? (
            <div className="p-likes cursor-pointer " onClick={() => handleClick()}> {val?.likes} Likes</div>
          ) : (
            <div className="p-likes cursor-pointer" onClick={() => handleClick()}> {val?.likes} Likes</div>
          )}
          {
            val?.viewed ? <div className="p-likes cursor-pointer" >{val?.viewed} Views</div> : null
          }
        </div>
        {val?.description ? (
          <div className="p-desc">
            <span>{val?.description}</span>
          </div>
        ) : null}
      </div>
      {toggleDetails && (
        <PostDetails
          key={val?.post_id}
          value={val}
          closeToggle={setToggleDetails}
        />
      )}
      {visibleShare && <UserListPopup visible={visibleShare} onClose={setVisibleShare} postValue={sharePostValue} />}
      {/* <SharePopup visible={visibleShare} onClose={setVisibleShare} /> */}
    </Fragment>
  );
};

export default PostCards;