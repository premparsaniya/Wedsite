import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { SpinningLoader, PostCardsContent, Loading } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { App_state, setPostList, LogoutUser, LogoutUserPost, /* setGetPostListToggle */ } from "~/reduxState";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext, resetUser } from "~/context";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pageNo, setPageNo] = useState<number>(1);
  
  const [loading, setLoading] = useState<boolean>(false);

  const { dispatch: disp } = useContext(AppContext);
  const { user } = useSelector((state: App_state) => state?.UserLogin);
  const postData = useSelector((s: App_state) => s?.PostListReducer);
  // const postListToggle = useSelector((s: App_state) => s?.GetPostListToggleReducer);

  const [hasNextPage, setHasNextPage] = useState(false);

  const [mainLoading, setMainLoading] = useState<boolean>(false);

  const limit = 10;

  const token = user?.token;
  // const [postDetailPath, setPostDetailPath] = useState<string>("")

  useEffect(() => {
    /* (!postListToggle) && */ getPostList();
  }, [/* updateLike , */ pageNo]);

  const getPostList = () => {
    pageNo === 1 && setMainLoading(true);
    setLoading(true);

    const postdataObj = {
      method: "get_post_list",
      page: pageNo,
      limit: limit,
      user_id: user.data.user_id,
    };

    fetch(`${import.meta.env.VITE_PUBLIC_URL}post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(postdataObj),
    })
      .then((result) => {
        result
          .json()
          .then((response) => {
            if (response.status === 1) {
              setMainLoading(false);
              let pLimit = limit;
              let pData = response?.data?.length;
              setHasNextPage(pData >= pLimit);
              if (pageNo === 1) {
                dispatch(setPostList(response?.data));
              } else {
                let clone = [...postData];
                response?.data && clone.push(...response?.data);
                dispatch(setPostList(clone));
                // dispatch(setGetPostListToggle(true))
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
      .catch(() => {
        console.log("error");
      });
  };

  const intObserver = useRef<any>();
  const lastPostRef = useCallback(
    (post: any) => {
      if (loading) return;
      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        // dispatch(setGetPostListToggle(false))
        if (posts[0].isIntersecting && hasNextPage) {
          setPageNo((prev) => prev + 1);
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [loading, hasNextPage]
  );

  return (
    <div className="home-main d-f">
      {mainLoading ? (
        <div className="w-full h-[100%] flex justify-center items-center">
          <Loading />
        </div>
      ) : postData?.length > 0 ? (
        postData?.map((val: any, index: number) => {
          return postData?.length === index + 1 ? (
            <PostCardsContent
              key={index}
              ref={lastPostRef}
              index={index}
              item={val}
              getPostList={getPostList}
            />
          ) : (
            <PostCardsContent
              key={index}
              index={index}
              item={val}
              getPostList={getPostList}
            />
          );
        })
      ) : (
        !loading && (
          <p className="flex items-center justify-center w-full text-xl text-center text-gray-500 h-52 text-bold">
            No Post yet !!
          </p>
        )
      )}
      {loading && !mainLoading && (
        <SpinningLoader
          isLoading
          colClass="text-black"
          size={10}
          className="flex items-center justify-center w-full mb-4"
        />
      )}
    </div>
  );
};

export default Home;
