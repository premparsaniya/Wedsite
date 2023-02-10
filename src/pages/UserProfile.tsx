import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { FollowBtnCheck, Followers, Loading, SpinningLoader } from "~/components";
import UserProfilePostCards from "../components/ForPagination/UserProfilePostCards";
import { MESSAGES_ICON, MORE_ICON, SETTING_BLACK_ICON } from "~/assets";
import { LogoutUser, LogoutUserPost } from "~/reduxState";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { App_state, setPostList } from "../reduxState";
// import PostDetails from "~/pages/PostDetails";
import { FollowEnum } from "~/functions";
import { toast } from "react-toastify";
import { DEF_USER } from "../assets";
import { SharePopup } from "./";
import { db, ref, set, onValue, push, child, update } from "~/utils";
import { AppContext, resetUser } from "~/context";
import PostDetails from "./PostDetails";

const UserProfile = () => {
  const { user } = useSelector((state: any) => state.UserLogin);
  const { dispatch: disp } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = user?.token;
  const postData = useSelector((s: App_state) => s?.PostListReducer);

  const [userProfile, setUserProfile] = useState<any>({});
  const [accountPrivacy, setAccountPrivacy] = useState<boolean>(false);
  const [followers, setFollowers] = useState<boolean>(false);
  const [following, setFollowing] = useState<boolean>(false);
  // const [visible, setVisible] = useState<boolean>(false);
  const [toggleDetails, setToggleDetails] = useState<boolean>(false);
  // const [postDetailsState, setPostDetailsState] = useState<any>({});
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [mainLoading, setMainLoading] = useState<boolean>(true);
  const [visibleShare, setVisibleShare] = useState<boolean>(false);
  const [followersCount, setFollowersCount] = useState<string>("")
  const [followingsCount, setFollowingsCount] = useState<string>("")
  const [isDecibel, setIsDecibel] = useState<string>("")
  const [postDataMainLoading, setPostDataMainLoading] = useState<boolean>(false);
  const [pDetails, setPDetails] = useState<any>({});
  const [handleGP, setHandleGP] = useState<boolean>(false);


  const limit = 10;

  useEffect(() => {
    getUserProfile(true);
    // setGetID((prev: string) => prev)
    // eslint-disable-next-line
  }, [id, handleGP]);

  useEffect(() => {
    // if (accountPrivacy !== true) {     
    getUserPost();
    // }
  }, [pageNo, accountPrivacy, handleGP, id]);

  // console.log("getId", getId)
  // console.log("id", id)

  // --------------------- Get User Profile ---------------------------------

  const getUserProfile = (toggleMainLoading: boolean) => {
    toggleMainLoading && setMainLoading(true);
    setPageNo(1)
    const obj = {
      method: "get_profile",
      user_id: user.data.user_id,
      user_2: id,
    };

    fetch(`${import.meta.env.VITE_API_URL}profile`, {
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
          setMainLoading(false);
          setUserProfile(response?.data);
          setFollowersCount(response?.data?.total_followers)
          setFollowingsCount(response?.data?.total_followings)
          if (user.data.user_id !== id) {
            if (
              (response.data.profile_status === "0") &&
              ((response.data.user_1_follow_request === null && response.data.user_2_follow_request === "accepted") || (response.data.user_1_follow_request === "" && response.data.user_2_follow_request === "accepted")) ||
              (response.data.user_1_follow_request === "pending" && response.data.user_2_follow_request === null) || (response.data.user_1_follow_request === "pending" && response.data.user_2_follow_request === "")
              || (response.data.user_1_follow_request === "pending" && response.data.user_2_follow_request === "accepted")
            ) {
              setAccountPrivacy(true);
            }
          }
        } if (response.status === 2) {
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

  // --------------------- Get User Post ---------------------------------

  const getUserPost = () => {
    pageNo === 1 && setPostDataMainLoading(true)
    setLoading(true);
    const obj = {
      method: "get_post_list",
      page: pageNo,
      limit: limit,
      user_id: user.data.user_id,
      user_2: id,
    };
    fetch(`${import.meta.env.VITE_API_URL}post`, {
      method: "POST",
      headers: {
        accept: "application/json",
        contentType: "application/json",
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    }).then((res) => {
      res
        .json()
        .then((response) => {
          if (response.status === 1) {
            setPostDataMainLoading(false)
            let pLimit = limit;
            let pData = response?.data?.length;
            setHasNextPage(pData >= pLimit);
            if (pageNo === 1) {
              dispatch(setPostList(response?.data));
            } else {
              let clone = [...postData];
              response?.data && clone.push(...response?.data);
              dispatch(setPostList(clone));
            }
          }
        })
        .finally(() => setLoading(false));
    });
  };

  // --------------------- Button Handler ---------------------------------

  const followBtnClick = (type: FollowEnum, action: string, userItem: any) => {

    if (type == FollowEnum.typeFollow) {
      setBtnLoading(true)
      setIsDecibel(userItem?.user_id)
      const obj = {
        method: "do_follow",
        user_id: user?.data?.user_id,
        user_2: userItem?.user_id,
      };

      fetch(`${import.meta.env.VITE_API_URL}profile`, {
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
            setIsDecibel("")
            setBtnLoading(false)
            let newPostData = {
              ...userItem,
              user_1_follow_request: response?.extra?.user_1_follow_request,
              user_2_follow_request: response?.extra?.user_2_follow_request,
            };
            setUserProfile(newPostData);
            getUserProfile(true);
          } else {
            setBtnLoading(false)
            setIsDecibel("")
          }
        });
      });
    } else if (type == FollowEnum.typeUnfollow) {
      // UN FOLLOW
      setBtnLoading(true)
      setIsDecibel(userItem?.user_id)
      const obj = {
        method: "unfollow",
        user_id: user?.data?.user_id,
        user_2: userItem?.user_id,
      };

      fetch(`${import.meta.env.VITE_API_URL}profile`, {
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
            setIsDecibel("")
            setBtnLoading(false)
            let newPostData = {
              ...userItem,
              user_1_follow_request: response?.extra?.user_1_follow_request,
              user_2_follow_request: response?.extra?.user_2_follow_request,
            };
            setUserProfile(newPostData);
            getUserProfile(true);
          } else {
            setBtnLoading(false)
            setIsDecibel("")
          }
        });
      });
    } else if (type == FollowEnum.typeFollowBack) {
      // FOLLOW BACK
      setBtnLoading(true)
      setIsDecibel(userItem?.user_id)
      const obj = {
        method: "do_follow",
        user_id: user?.data?.user_id,
        user_2: userItem?.user_id,
      };

      fetch(`${import.meta.env.VITE_API_URL}profile`, {
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
            setBtnLoading(false)
            setIsDecibel("")
            let newPostData = {
              ...userItem,
              user_1_follow_request: response?.extra?.user_1_follow_request,
              user_2_follow_request: response?.extra?.user_2_follow_request,
            };
            setUserProfile(newPostData);
            getUserProfile(false);
          } else {
            setBtnLoading(false)
            setIsDecibel("")
          }
        });
      });
    } else if (type == FollowEnum.typeRequestSent) {
      // REQUEST SENT
      setBtnLoading(true)
      setIsDecibel(userItem?.user_id)
      const obj = {
        method: "cancel_follow_request",
        user_id: user?.data?.user_id,
        user_2: userItem?.user_id,
      };
      fetch(`${import.meta.env.VITE_API_URL}profile`, {
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
            setBtnLoading(false)
            setIsDecibel("")
            let newPostData = {
              ...userItem,
              user_1_follow_request: response?.extra?.user_1_follow_request,
              user_2_follow_request: response?.extra?.user_2_follow_request,
            };
            setUserProfile(newPostData);
            getUserProfile(false);
          } else {
            setBtnLoading(false)
            setIsDecibel("")
          }
        });
      });
    } else if (type == FollowEnum.typeGotRequest) {
      // ACCEPT / REJECT REQUEST
      if (action === "accept") {
        setBtnLoading(true)
        setIsDecibel(userItem?.user_id)
        const obj = {
          method: "accept_follow_request",
          user_id: user?.data?.user_id,
          user_2: userItem?.user_id,
        };

        fetch(`${import.meta.env.VITE_API_URL}profile`, {
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
              setBtnLoading(false)
              setIsDecibel("")
              let newPostData = {
                ...userItem,
                user_1_follow_request: response?.extra?.user_1_follow_request,
                user_2_follow_request: response?.extra?.user_2_follow_request,
              };
              setUserProfile(newPostData);
              getUserProfile(false);
            } else {
              setBtnLoading(false)
              setIsDecibel("")
            }
          });
        });
      } else {
        setBtnLoading(true)
        setIsDecibel(userItem?.user_id)
        const obj = {
          method: "reject_follow_request",
          user_id: user?.data?.user_id,
          user_2: userItem?.user_id,
        };

        fetch(`${import.meta.env.VITE_API_URL}profile`, {
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
              setBtnLoading(false)
              setIsDecibel("")
              let newPostData = {
                ...userItem,
                user_1_follow_request: response?.extra?.user_1_follow_request,
                user_2_follow_request: response?.extra?.user_2_follow_request,
              };
              setUserProfile(newPostData);
              getUserProfile(false);
            } else {
              setBtnLoading(false)
              setIsDecibel("")
            }
          });
        });
      }
    }
  };

  const editProfile = () => {
    navigate(`/uapp/ep/${id}/${"gen"}`);
  };

  const getUserProfileAllPostClick = (uId: number) => {
    if (!accountPrivacy) {
      navigate(`/postlist/${id}`);
    }
  };

  const GoSettings = () => {
    navigate(`/uapp/ep/${id}/${"settings"}`);
  };

  const getFollowers = () => {
    setFollowers(!followers);
  };

  const getFollowing = () => {
    setFollowing(!following);
  };

  const showPostDetailsClick = (value: any) => {
    setPDetails(value)
    setToggleDetails(!toggleDetails)
  };

  const intObserver = useRef<any>();
  const lastPostRef = useCallback(
    (post: any) => {
      if (loading) return;
      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          setPageNo((prev) => prev + 1);
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [loading, hasNextPage, id]
  );

  // ------------- generate unique id function  -------------

  function getUniqueChatId(otherUserId: string) {
    let intUserId = parseInt(user?.data?.user_id)
    let intOtherUserId = parseInt(otherUserId)

    // let kb = intUserId + intOtherUserId

    let result = (intUserId * intOtherUserId)
    return result.toString()
  }

  const goMsgClick = (item: any) => {

    let generateId = getUniqueChatId(item?.user_id)

    navigate(`/messages/${generateId}`)

    const chatHRef = ref(db, `chathistory/${user?.data?.user_id}`);
    const newChatHRef = child(chatHRef, generateId)

    onValue(newChatHRef, (snapshot) => {
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

      }
    });

    const chatRoomRef = ref(db, `chatroom/`);
    const newChatRoomRef = child(chatRoomRef, generateId);

    let chatRoomObj = {
      channel_Id: generateId,
      opp_userId: item?.user_id,
      user_id: user?.data?.user_id,
    }
    set(newChatRoomRef, chatRoomObj);

    // ----------------- create chat Room --------------------------------

    // if (chatData.map((item) => item.chatHistoryId !== generateId)) {
    //   let chatRoomObj = {
    //     channel_Id: generateId,
    //     opp_userId: item?.user_id,
    //     user_id: user?.data?.user_id,
    //   }
    //   update(newChatRoomRef, chatRoomObj);
    // } else {
    //   let chatRoomObj = {
    //     channel_Id: generateId,
    //     opp_userId: item?.user_id,
    //     user_id: user?.data?.user_id,
    //   }
    //   set(newChatRoomRef, chatRoomObj);
    // }



    const dbRef = ref(db, `messages/${generateId}`);
    onValue(dbRef, (snapshot) => {
      let msgArr: any[] = []
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        msgArr.push(childData)
      });
    });
  }

  return (
    <>
      {/* =================================== */}
      <main className="mt-16 bg-opacity-25">
        {mainLoading ? (
          <div className="w-full h-[100%] flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <div className="mb-8 lg:w-8/12 lg:mx-auto">
            <header className="flex flex-wrap items-center p-4 md:py-8">
              <div className="md:w-3/12 md:ml-16">
                <img
                  className="object-cover w-20 h-20 p-1 border-2 border-black rounded-full md:w-40 md:h-40"
                  alt="profile"
                  src={userProfile?.photo || DEF_USER}
                  crossOrigin="anonymous"
                  onError={(e: any) =>
                    (e.target.onerror = null) || (e.target.src = DEF_USER)
                  }
                />
              </div>

              <div className="w-8/12 ml-4 md:w-7/12">
                <div className="mb-4 md:flex md:flex-wrap md:items-center">
                  <h2 className="inline-block mb-2 text-3xl font-light md:mr-2 sm:mb-0">
                    {userProfile?.name || "UserName"}
                  </h2>

                  <span
                    className="relative inline-block mr-6 text-xl text-blue-500 transform -translate-y-2 fas fa-certificate fa-lg"
                    aria-hidden="true"
                  >
                    <i
                      className="absolute inset-x-0 mt-px ml-1 text-xs text-white fas fa-check"
                    ></i>
                  </span>

                  {userProfile ? (
                    <>
                      {id === user.data.user_id ? (
                        <>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span className="up-un-ed d-f">
                              <button
                                className="primary-btn-sm"
                                onClick={() => editProfile()}
                              >
                                Edit Profile
                              </button>
                            </span>{" "}
                            <span className="up-un-st d-f">
                              <img
                                src={SETTING_BLACK_ICON}
                                alt="setting"
                                className="object-contain w-5 h-5"
                                onClick={() => GoSettings()}
                              />
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex">
                            <FollowBtnCheck
                              key={userProfile}
                              followBtnClick={followBtnClick}
                              user1={userProfile?.user_1_follow_request}
                              user2={userProfile?.user_2_follow_request}
                              userItem={userProfile}
                              loading={btnLoading}
                              isDecibel={isDecibel}
                            />
                            <img src={MORE_ICON} alt="more" className="ml-3" onClick={() => setVisibleShare(!visibleShare)} />
                            {userProfile?.user_1_follow_request === "accepted" ? (
                              <img
                                src={MESSAGES_ICON}
                                alt="more"
                                className="ml-3"
                                onClick={() => goMsgClick(userProfile)}
                              />
                            ) : null}
                          </div>
                        </>
                      )}
                    </>
                  ) : null}
                </div>

                <ul className="hidden mb-4 space-x-8 md:flex">
                  <li>
                    <span
                      className="font-semibold"
                      onClick={() =>
                        getUserProfileAllPostClick(userProfile?.user_id)
                      }
                    >
                      {userProfile?.posts[0].total_post} posts
                    </span>
                  </li>

                  <li>
                    <span className="font-semibold">
                      {followers ? (
                        <>
                          <span onClick={() => getFollowers()}>
                            {followersCount} followers
                          </span>
                          {!accountPrivacy ? (
                            <>
                              <Followers
                                uid={id}
                                title={"Followers"}
                                setFollowers={setFollowers}
                                setFollowing={setFollowing}
                                user1Status={userProfile?.user_1_follow_request}
                                user2Status={userProfile?.user_2_follow_request}
                                followingsCount={followingsCount}
                                setFollowingsCount={setFollowingsCount}
                              />
                            </>
                          ) : null}
                        </>
                      ) : (
                        <span onClick={() => getFollowers()}>
                          {followersCount} followers
                        </span>
                      )}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">
                      {following ? (
                        <>
                          <span onClick={() => getFollowing()}>
                            {followingsCount} following
                          </span>
                          {!accountPrivacy ? (
                            <>
                              <Followers
                                uid={id}
                                title={"Following"}
                                setFollowers={setFollowers}
                                setFollowing={setFollowing}
                                user1Status={userProfile?.user_1_follow_request}
                                user2Status={userProfile?.user_2_follow_request}
                                followingsCount={followingsCount}
                                setFollowingsCount={setFollowingsCount}
                              />
                            </>
                          ) : null}
                        </>
                      ) : (
                        <span onClick={() => getFollowing()}>
                          {followingsCount} following
                        </span>
                      )}
                    </span>
                  </li>
                </ul>

                <div className="hidden md:block">
                  <span>{userProfile?.bio}</span>
                </div>
              </div>

              <div className="my-2 text-sm md:hidden">
                <span>{userProfile?.bio}</span>
              </div>
            </header>

            <div className="px-px md:px-3">
              <ul
                className="flex justify-around p-2 space-x-8 text-sm leading-snug text-center text-gray-600 border-t md:hidden"
              >
                <li>
                  <span
                    className="block font-semibold text-gray-800"
                    onClick={() =>
                      getUserProfileAllPostClick(userProfile?.user_id)
                    }
                  >
                    {userProfile?.posts[0].total_post} posts
                  </span>
                </li>

                <li>
                  <span className="block font-semibold text-gray-800">
                    {followers ? (
                      <>
                        <span onClick={() => getFollowers()}>
                          {followersCount} followers
                        </span>
                        {!accountPrivacy ? (
                          <>
                            <Followers
                              uid={id}
                              title={"Followers"}
                              setFollowers={setFollowers}
                              setFollowing={setFollowing}
                              user1Status={userProfile?.user_1_follow_request}
                              user2Status={userProfile?.user_2_follow_request}
                              followingsCount={followingsCount}
                              setFollowingsCount={setFollowingsCount}
                            />
                          </>
                        ) : null}
                      </>
                    ) : (
                      <span onClick={() => getFollowers()}>
                        {followersCount} followers
                      </span>
                    )}
                  </span>
                </li>
                <li>
                  <span className="block font-semibold text-gray-800">
                    {following ? (
                      <>
                        <span onClick={() => getFollowing()}>
                          {followingsCount} following
                        </span>
                        {!accountPrivacy ? (
                          <>
                            <Followers
                              uid={id}
                              title={"Following"}
                              user1Status={userProfile?.user_1_follow_request}
                              user2Status={userProfile?.user_2_follow_request}
                              setFollowing={setFollowing}
                              setFollowers={setFollowers}
                              followingsCount={followingsCount}
                              setFollowingsCount={setFollowingsCount}
                            />
                          </>
                        ) : null}
                      </>
                    ) : (
                      <span onClick={() => getFollowing()}>
                        {followingsCount} following
                      </span>
                    )}
                  </span>
                </li>
              </ul>
              <div className="mb-5 border-t " />
              <div className="flex flex-wrap -mx-px md:-mx-3">
                {postDataMainLoading ? <SpinningLoader
                  isLoading
                  colClass="text-black"
                  size={20}
                  className="flex items-center justify-center w-full mb-4"
                /> : postData?.length > 0
                  ? postData?.map((val: any, index: number) => {
                    return postData?.length === index + 1 ? (
                      <UserProfilePostCards
                        key={index}
                        item={val}
                        index={index}
                        showPostDetailsClick={showPostDetailsClick}
                        ref={lastPostRef}
                      />
                    ) : (
                      <UserProfilePostCards
                        key={index}
                        item={val}
                        index={index}
                        showPostDetailsClick={showPostDetailsClick}
                      />
                    );
                  })
                  : !loading && (
                    <p className="flex items-center justify-center w-full text-xl text-center text-gray-500 h-52 text-bold">
                      No posts yet !!
                    </p>
                  )}
              </div>
              {loading && !postDataMainLoading && (
                <SpinningLoader
                  isLoading
                  colClass="text-black"
                  size={10}
                  className="flex items-center justify-center w-full mb-4"
                />
              )}
            </div>
          </div>
        )}
      </main>
      {toggleDetails && (
        <PostDetails
          key={pDetails?.post_id}
          value={pDetails}
          closeToggle={setToggleDetails}
          setHandleGP={setHandleGP}
        />
      )}
      <SharePopup value={userProfile} visible={visibleShare} onClose={setVisibleShare} />
    </>
  );
};

export default UserProfile;
