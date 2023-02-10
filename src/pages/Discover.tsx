import { SEARCH_ICON, FILTER } from "../assets";
import {
  forwardRef,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { DEF_USER } from "~/assets";
import FollowBtnCheck from "../components/FollowBtnCheck";
import { FollowEnum /* FollowType */ } from "../functions";
// import { PostCardWithDetails } from "~/components";
import FilterPopup from "~/components/FilterPopup";
import useDebounce from "~/hooks/useDebounce";
import PostDetails from "./PostDetails";
import { useNavigate } from "react-router-dom";
import DiscoverUserCards from "~/components/ForPagination/DiscoverUserCards";
import { SpinningLoader } from "~/components";
import DiscoverVideoCards from "~/components/ForPagination/DiscoverVideoCards";
import { LogoutUser, LogoutUserPost } from "~/reduxState";
import { toast } from "react-toastify";
import { AppContext, resetUser } from "~/context";

function Discover() {
  const { user } = useSelector((state: any) => state.UserLogin);
  const token = user?.token;

  const { dispatch: disp } = useContext(AppContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [segment, setSegment] = useState("user");
  const [userData, setUserData] = useState<any>([]);
  const [userCount, setUserCount] = useState<any>([]);
  const [searchResult, setSearchResult] = useState<string>("");
  const [handleFilter, setHandleFilter] = useState<boolean>(false);
  const [postData, setPostData] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");

  const [userNumber, setUserNumber] = useState<any>();
  const [videoNumber, setVideoNumber] = useState<any>();

  const [visible, setVisible] = useState<boolean>(false);
  const [toggleDetails, setToggleDetails] = useState<boolean>(false);
  const [postDetailsState, setPostDetailsState] = useState<any>({});

  const debounceVal = useDebounce(searchResult, 700);
  const [pageNo, setPageNo] = useState<number>(1);

  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDecibel, setIsDecibel] = useState<string>("")

  // const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const limit = 10;



  // useEffect(() => {
  // getAllUsers();
  // getUserCount();
  // getPostList();
  // }, [pageNo]);

  useEffect(() => {
    getAllUsers();
    getUserCount();
    getPostList();
  }, [debounceVal, selectedValue, pageNo]);

  const getAllUsers = () => {
    setLoading(true);
    const obj = {
      method: "get_all_users",
      page: pageNo,
      limit: limit,
      search: debounceVal,
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
    })
      .then((res) => {
        res
          .json()
          .then((response) => {
            if (response.status === 1) {
              let pLimit = limit;
              let pData = response?.data?.length;
              setHasNextPage(pData >= pLimit);
              if (pageNo === 1) {
                setUserData(response.data);
              } else {
                let clone = [...userData];
                response?.data && clone.push(...response?.data);
                setUserData(clone);
              }
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
          .finally(() => setLoading(false));
      })
      .catch((e) => {
        console.error("error");
      });
  };

  const getUserCount = () => {
    const obj = {
      method: "get_post_count",
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
    })
      .then((res) => {
        res.json().then((response) => {
          if (response.status === 1) {
            forUserCount(response?.data?.user_count);
            forPostCount(response?.data?.post_count);
          } else {
            console.log("error");
          }
        });
      })
      .catch((e) => {
        console.error("error");
      });
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
    [loading, hasNextPage]
  );

  const intObserverForVid = useRef<any>();
  const lastPostRefForVid = useCallback(
    (post: any) => {
      if (loading) return;
      if (intObserverForVid.current) intObserverForVid.current.disconnect();

      intObserverForVid.current = new IntersectionObserver((posts) => {        
        if (posts[0].isIntersecting && hasNextPage) {
          setPageNo((prev) => prev + 1);
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [loading, hasNextPage]
  );

  const getPostList = () => {
    const obj = {
      method: "get_post_list",
      page: pageNo,
      limit: limit,
      search: debounceVal,
      filter_by: selectedValue,
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
    })
      .then((res) => {
        res.json().then((response) => {
          if (response.status === 1) {
            let pLimit = limit;
            let pData = response?.data?.length;
            setHasNextPage(pData >= pLimit);
            if (pageNo === 1) {
              setPostData(response.data);
            } else {
              let clone = [...postData];
              response?.data && clone.push(...response?.data);
              setPostData(clone);
            }
          }
        });
      })
      .catch((e) => {
        console.log("error");
      });
  };

  const filterVideosClick = () => {
    setHandleFilter(!handleFilter);
  };

  const showPostDetailsClick = (value: any) => {
    navigate(`/postdetails/${value?.post_id}`, { state: { value: value } })
    // setPostDetailsState(value);
    // setToggleDetails(!toggleDetails);
  };

  const goProfile = (id: number) => {
    navigate(`/userprofile/${id}`);
  };


  const forUserCount = (num: any) => {
    num = num.toString().replace(/[^0-9.]/g, '');
    if (num < 1000) {
      return setUserNumber(num);
    }
    let si = [
      { v: 1E3, s: "K" },
      { v: 1E6, s: "M" },
      { v: 1E9, s: "B" },
      { v: 1E12, s: "T" },
      { v: 1E15, s: "P" },
      { v: 1E18, s: "E" }
    ];
    let index;
    for (index = si.length - 1; index > 0; index--) {
      if (num >= si[index].v) {
        break;
      }
    }
    return setUserNumber((num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s)
  }

  const forPostCount = (num: any) => {
    num = num.toString().replace(/[^0-9.]/g, '')
    if (num < 1000) {
      return setVideoNumber(num)
    }
    let si = [
      { v: 1E3, s: "K" },
      { v: 1E6, s: "M" },
      { v: 1E9, s: "B" },
      { v: 1E12, s: "T" },
      { v: 1E15, s: "P" },
      { v: 1E18, s: "E" }
    ];
    let index;
    for (index = si.length - 1; index > 0; index--) {
      if (num >= si[index].v) {
        break;
      }
    }
    return setVideoNumber((num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s)
  }

  return (
    <section className="discover-p_m">
      <div className="discover-box">
        <div className="discover-header">Discover</div>
        <div className="discover-border"></div>
        <div className="discover-uv">
          <div className="discover-title">
            <ul className="segmented-control">
              <li
                className="segmented-control__item"
                onClick={() => setSegment("user")}
              >
                <input
                  className="segmented-control__input"
                  type="radio"
                  value="user"
                  name="option"
                  id="option-1"
                  checked={segment === "user"}
                  onChange={() => { }}
                />
                <label className="segmented-control__label" htmlFor="option-1">
                  User ({userNumber || 0})
                </label>
              </li>
              <li
                className="segmented-control__item"
                onClick={() => setSegment("video")}
              >
                <input
                  className="segmented-control__input"
                  type="radio"
                  value="video"
                  name="option"
                  id="option-2"
                  checked={segment === "video"}
                  onChange={() => { }}
                />
                <label className="segmented-control__label" htmlFor="option-2">
                  Videos ({videoNumber || 0})
                </label>
              </li>
            </ul>
          </div>
          <div className="discover-search-flex">
            <div className="mb-2 discover-search-bar">
              <img
                src={SEARCH_ICON}
                alt="Search"
                className="navbar__icon mr-2.5 ml-2.5"
              />
              <input
                value={searchResult}
                className="search-box "
                placeholder="Search"
                onChange={(e) => setSearchResult(e.target.value)}
              />
            </div>
            {segment === "video" && (
              <div
                className="discover-filter"
                onClick={() => filterVideosClick()}
              >
                <img src={FILTER} alt="filter" />
              </div>
            )}
          </div>
          <FilterPopup
            visible={handleFilter}
            closePopup={filterVideosClick}
            setSelectedValue={setSelectedValue}
            apiFunction={getPostList}
          />
          <div className="" style={{ height: "620px", overflow: "scroll" }}>
            {segment === "user" && userData?.length > 0
              ? userData.map((userItem: any, index: any) => {
                return userData?.length === index + 1 ? (
                  <DiscoverUserCards
                    key={index}
                    item={userItem}
                    index={index}
                    goProfile={goProfile}
                    userData={userData}
                    setUserData={setUserData}
                    ref={lastPostRef}
                    isDecibel={isDecibel}
                    setIsDecibel={setIsDecibel}
                  />
                ) : (
                  <DiscoverUserCards
                    key={index}
                    item={userItem}
                    goProfile={goProfile}
                    index={index}
                    userData={userData}
                    setUserData={setUserData}
                    isDecibel={isDecibel}
                    setIsDecibel={setIsDecibel}
                  />
                );
              })
              : !loading && segment === "user" && <p>No user yet !!</p>}
            {loading && segment === "user" && (
              <SpinningLoader
                isLoading
                colClass="text-black"
                size={10}
                className="flex items-center justify-center w-full mb-4"
              />
            )}

            {segment === "video" && (
              <div className="discover-video-list-box">
                {postData?.length > 0
                  ? postData.map((item: any, index: number) => {
                    return postData?.length === index + 1 ? (
                      <DiscoverVideoCards
                        key={index}
                        item={item}
                        index={index}
                        showPostDetailsClick={showPostDetailsClick}
                        ref={lastPostRefForVid}
                      />
                    ) : (
                      <DiscoverVideoCards
                        key={index}
                        item={item}
                        index={index}
                        showPostDetailsClick={showPostDetailsClick}
                      />
                    );
                  })
                  : !loading &&
                  segment === "video" && (
                    <p className="flex items-center justify-center w-full text-xl text-center text-gray-500 h-52 text-bold">
                      No video yet !!
                    </p>
                  )}
              </div>
            )}
            {loading && segment === "video" && (
              <SpinningLoader
                isLoading
                colClass="text-black"
                size={10}
                className="flex items-center justify-center w-full mb-4"
              />
            )}
          </div>
        </div>
      </div>
      {/* {toggleDetails && (
        <PostDetails
          key={postDetailsState?.post_id}
          visible={visible}
          onClose={() => {
            setVisible(!visible), setToggleDetails(!toggleDetails);
          }}
          value={postDetailsState}
          getPostList={getPostList}
        />
      )} */}
    </section>
  );
}

export default Discover;
