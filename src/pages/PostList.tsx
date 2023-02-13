import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
// import { STATE_BLACK_LOGO } from "~/assets";
import PostDetails from "./PostDetails";
import { getMyPost } from "~/reduxState";
import { GetAllPostContent, Loading, SpinningLoader } from "~/components";

function PostList() {
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.UserLogin);
  const token = user?.token;
  const { id } = useParams();
  const navigate = useNavigate();

  const [upost, setUPost] = useState<any[]>([]);

  // const [loadMore, setLoadMore] = useState<boolean>(false);

  const [toggleDetails, setToggleDetails] = useState<boolean>(false);
  const [postDetailsState, setPostDetailsState] = useState<any>({});
  const [handleGP, setHandleGP] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);

  const [mainLoading, setMainLoading] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const limit = 10;

  useEffect(() => {
    getUserPostList();
  }, [pageNo, handleGP]);

  // console.log("location", location)
  const getUserPostList = () => {
    setMainLoading(true);
    pageNo !== 1 && setLoading(true);
    const obj = {
      method: "get_post_list",
      page: pageNo,
      limit: limit,
      user_id: user?.data?.user_id,
      user_2: id,
      all_post: true,
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
          setLoading(false);
          setMainLoading(false);
          let pLimit = limit;
          let pData = response?.data?.length;
          setHasNextPage(pData >= pLimit);
          if (pageNo === 1) {
            setUPost(response.data);
          } else {
            let clone = [...upost];
            response?.data && clone.push(...response?.data);
            setUPost(clone);
          }

          if (pageNo === 1) {
            setUPost(response.data);
          } else {
            setUPost([...upost, ...response.data]);
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
  const showPostDetailsClick = (value: any) => {
    // navigate(`/postdetails/${value?.post_id}`, { state: { value: value } })
    setPostDetailsState(value);
    setToggleDetails(!toggleDetails);
  };

  return (
    <div className="lg:w-8/12 lg:mx-auto mb-8 ">
      {mainLoading && pageNo === 1 ? (
        <div className="w-full h-[100vh] flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-wrap -mx-px md:-mx-3 mt-20 ">
          {upost?.length > 0
            ? upost.map((val: any, index) => {
              return upost?.length === index + 1 ? (
                <GetAllPostContent
                  key={index}
                  val={val}
                  index={index}
                  showPostDetailsClick={showPostDetailsClick}
                  ref={lastPostRef}
                />
              ) : (
                <GetAllPostContent
                  key={index}
                  val={val}
                  index={index}
                  showPostDetailsClick={showPostDetailsClick}
                />
              );
            })
            : !loading && (
              <p className=" text-center h-52 w-full flex justify-center items-center text-gray-500 text-xl text-bold">
                No post yet !!
              </p>
            )}
          {/* ========================================================================= */}
        </div>
      )}
      {loading && (
        <SpinningLoader
          isLoading
          colClass="text-black"
          size={10}
          className="mb-4 w-full flex justify-center items-center"
        />
      )}
      {toggleDetails && (
        <PostDetails
          key={postDetailsState?.post_id}
          closeToggle={setToggleDetails}
          value={postDetailsState}
          setHandleGP={setHandleGP}
          handleGP={handleGP}
        />
      )}
    </div>
  );
}
export default PostList;
