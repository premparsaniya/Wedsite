import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loading, SaveBookMarkContent, SpinningLoader } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { App_state, setPostList } from "~/reduxState";
import { BACK_ICON, EMPTY_ICON } from "~/assets";
const SaveBookMark = () => {
  const { user } = useSelector((state: any) => state.UserLogin);
  const postData = useSelector((s: App_state) => s?.PostListReducer);

  const token = user?.token;
  const limit = 10;

  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBackArrow = () => {
    navigate(-1);
  };

  // const [bPost, setBPost] = useState<any>([]);

  useEffect(() => {
    getBookMarkList();
  }, [pageNo]);

  const getBookMarkList = () => {
    pageNo === 1 && setLoading(true);
    setListLoading(true);
    const obj = {
      method: "get_post_list",
      user_id: user.data.user_id,
      page: pageNo,
      limit: limit,
      filter_by: {
        bookmark: 1,
      },
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
      res.json().then((response) => {
        console.log("bm --->", response);
        if (response.status === 1) {
          setLoading(false);
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
          // console.log("save ----->", response)
        } else {
          // console.log("else", response);
        }
      });
    }).finally(() => setListLoading(false));
  };

  const intObserver = useRef<any>();
  const lastPostRef = useCallback(
    (post: any) => {
      if (listLoading) return;
      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {        
        if (posts[0].isIntersecting && hasNextPage) {
          setPageNo((prev) => prev + 1);
        }
      });
      if (post) intObserver.current.observe(post);
    },
    [listLoading, hasNextPage]
  );

  return (
    <>
      <div className="sb-header-div">
        <img
          src={BACK_ICON}
          alt="back"
          className="back-arrow"
          onClick={handleBackArrow}
        />
        <span className="page-title-span">Save Bookmark</span>
      </div>
      {loading ? (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <Loading size={100} />
        </div>
      ) : postData?.length === 0 ? (
        <>
          {" "}
          <div className="no-video-div">
            <img src={EMPTY_ICON} alt="EMpty" className="no-video-icon" />
            <span className="no-video-span">No Videos</span>
          </div>
        </>
      ) : (
        <>
          <div className="sb-content-div">
            {postData?.length > 0
              ? postData.map((item: any, index: number) => {
                return postData?.length === index + 1 ? (
                  <SaveBookMarkContent
                    key={index}
                    index={index}
                    item={item}
                    ref={lastPostRef}
                    getBookMarkList={getBookMarkList}
                  />
                ) : (
                  <SaveBookMarkContent
                    key={index}
                    index={index}
                    item={item}
                    getBookMarkList={getBookMarkList}
                  />
                );
              })
              : !listLoading && <p>No users yet !!</p>}
            {listLoading && (
              <SpinningLoader
                isLoading
                colClass="text-black"
                size={10}
                className="mb-4 w-full flex justify-center items-center"
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default SaveBookMark;
