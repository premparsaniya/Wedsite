import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BACK_ICON, EMPTY_ICON } from "~/assets";
import { Loading, PostCardWithDetails } from "../components";

const HiddenPost = () => {
  const navigate = useNavigate();

  const handleBackArrow = () => {
    navigate(-1);
  };

  const [hPost, setHPost] = useState<any>([]);

  const { user } = useSelector((state: any) => state.UserLogin);
  const token = user?.token;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getHiddenPostList();
  }, []);

  const getHiddenPostList = () => {
    setLoading(true);
    const obj = {
      method: "hidden_post_list",
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
          setLoading(false);
          setHPost(response?.data);
        } else {
          // console.log("else", response);
        }
      });
    });
  };

  return (
    <>
      <div className="sb-header-div">
        <img
          src={BACK_ICON}
          alt="back"
          className="back-arrow"
          onClick={handleBackArrow}
        />
        <span className="page-title-span">Hidden Post</span>
      </div>
      {loading ? (
        <div className="w-full h-[100%] flex justify-center items-center flex-col mt-36">
          <Loading size={100} />
        </div>
      ) : hPost?.length === 0 ? (
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
            {hPost?.map((item: any, index: number) => {
              return <PostCardWithDetails key={index} item={item} getHiddenPostList ={getHiddenPostList} />;
            })}
            {/* {
              hPost.map((item: any, index: number) => {
                return (
                  <Fragment key={index}>
                    <PostCardWithDetails item={item} />
                  </Fragment>
                )
              })
            } */}
          </div>
        </>
      )}
    </>
  );
};

export default HiddenPost;
