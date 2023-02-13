import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { CLOSE_BLACK_ICON } from "~/assets";
import { useNavigate } from "react-router-dom";
import FollowersContent from "./ForPagination/FollowersContent";
import SpinningLoader from "./Animation/SpinningLoader";

type Props = {
  uid: any;
  title: any;
  setFollowers: (b: boolean) => void;
  setFollowing: (b: boolean) => void;
  user1Status: string;
  user2Status: string;
  followingsCount: string
  setFollowingsCount: (s: string) => void,
};

const Followers = ({
  uid,
  title,
  setFollowers,
  setFollowing,
  user1Status,
  user2Status,
  followingsCount,
  setFollowingsCount,
}: Props) => {
  const { user } = useSelector((state: any) => state.UserLogin);
  const navigate = useNavigate();

  const [result, setResult] = useState<any[]>([]);

  const [hasNextPage, setHasNextPage] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState(1);
  const [isDecibel, setIsDecibel] = useState<string>("")

  const limit = 10;

  const token = user?.token;
  const goBack = () => {
    if (title === "Following") {
      setFollowing(false);
    } else {
      setFollowers(false);
    }
  };

  useEffect(() => {
    getData();
  }, [user1Status, user2Status, pageNo]);

  const getData = () => {
    setLoading(true);
    const obj = {
      method: title === "Followers" ? "get_followers" : "get_followings",
      user_id: user.data.user_id,
      user_2: uid,
      page: pageNo,
      limit: limit,
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
        if (response.status === 1) {
          setLoading(false);
          if (title === "Followers") {
            // console.log("followers res--->", response)
            let pLimit = limit;
            let pData = response?.data?.followers?.length;
            setHasNextPage(pData >= pLimit);
            if (pageNo === 1) {
              setResult(response?.data?.followers);
            } else {
              let clone = [...result];
              response?.data?.followers &&
                clone.push(...response?.data?.followers);
              setResult(clone);
            }
          } else {
            // console.log("following res--->", response)
            let pLimit = limit;
            let pData = response?.data?.followings?.length;
            setHasNextPage(pData <= pLimit);
            if (pageNo === 1) {
              setResult(response?.data?.followings);
            } else {
              let clone = [...result];
              response?.data?.followings &&
                clone.push(...response?.data?.followings);
              setResult(clone);
            }
          }
        }
      });
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

  const goProfile = (id: string) => {
    navigate(`/userprofile/${id}`);
    if (title === "Following") {
      setFollowing(false);
    } else {
      setFollowers(false);
    }
  };

  return (
    <>
      <div className="followers-main fixed text-black overflow-auto left-0 right-0 top-0 bottom-0 transition-all duration-300 ">
        <div className="followers-card  bg-white rounded-xl shadow-2xl p-6  sm:w-8/12 xs:w-8/12 mx-10 flex justify-center flex-col ">
          <div className="followers-heading">
            <span
              style={{
                padding: "10px 10px",
                width: "100%",
                textAlign: "center",
              }}
            >
              {title}
            </span>
            <span style={{ width: "30px" }} onClick={() => goBack()}>
              <img src={CLOSE_BLACK_ICON} alt="Close" />
            </span>
          </div>
          <div className="" style={{ overflow: "scroll", height: "470px" }}>
            {result?.length > 0
              ? result?.map((val: object, index: number) => {
                return result?.length === index + 1 ? (
                  <FollowersContent
                    key={index}
                    val={val}
                    index={index}
                    ref={lastPostRef}
                    goProfile={goProfile}
                    setResult={setResult}
                    result={result}
                    uid={uid}
                    followingsCount={followingsCount}
                    setFollowingsCount={setFollowingsCount}
                    isDecibel={isDecibel}
                    setIsDecibel={setIsDecibel}
                  />
                ) : (
                  <FollowersContent
                    key={index}
                    val={val}
                    index={index}
                    goProfile={goProfile}
                    setResult={setResult}
                    result={result}
                    uid={uid}
                    followingsCount={followingsCount}
                    setFollowingsCount={setFollowingsCount}
                    isDecibel={isDecibel}
                    setIsDecibel={setIsDecibel}

                  />
                );
              })
              : !loading && <p>No Data yet !!</p>}
            {loading && (
              <SpinningLoader
                isLoading
                colClass={`text-black ${result?.length === 0 ? "mt-40" : ""}`}
                size={10}
                className="mb-4 w-full flex justify-center items-center"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Followers;
