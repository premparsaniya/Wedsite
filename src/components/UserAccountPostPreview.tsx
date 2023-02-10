import { useEffect, useRef, useState } from "react";
import { UserIcon, ShowComm, EditPost, ReportPost, DeleteConform } from "./";
import { useParams, useNavigate } from "react-router-dom";
import { Like, Chat, Send, DefaultImg, DEF_USER } from "~/assets/";
import { useSelector } from "react-redux";
import { MORE_ICON } from "~/assets";
import moment from "moment";

const UserAccountPostPreview = () => {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [postData, setPostData] = useState<any>("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state: any) => state.UserLogin);
  const [showComment, setShowComment] = useState<any[]>([]);
  const [edCommId, setEdCommId] = useState<string>("");
  const [edtPostMenu, setEdtPostMenu] = useState<boolean>(false);
  const [dlCom, setDlCom] = useState<string>("");
  const [report, setReport] = useState<boolean>(false);
  const [conformPostDelete, setConformPostDelete] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [likePostStatus, setLikePostStatus] = useState<boolean>(false);
  const [playBool, setPlayBool] = useState<boolean>(false);
  const [soundBool, setSoundBool] = useState<boolean>(false);

  const videoRef = useRef<any>();

  const token = user?.token;
  const back = () => {
    navigate(-1);
  };
  const checkLength = (e: any) => {
    e.target.value.length < 251 && setComment(e.target.value);
  };

  useEffect(() => {
    const obj = {
      method: "get_post",
      post_id: id,
      user_id: user.data.user_id,
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
            setPostData(response);
            setImgSrc(response.data.attachments[0].attachment);
            commentApi();
          }
          // console.log("response.data[0].attachment", response);
        });
      })
      .catch((e) => {
        // console.error("post preview Error ...", e);
      });
  }, [edCommId, dlCom, likePostStatus]);

  const commentApi = () => {
    const obj2 = {
      method: "get_post_comments",
      post_id: id,
      page: 1,
      limit: 30,
      user_id: user.data.user_id,
    };

    fetch(`${import.meta.env.VITE_API_URL}post`, {
      method: "POST",
      headers: {
        accept: "application/json",
        contentType: "application/json",
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(obj2),
    }).then((res) => {
      res.json().then((response) => {
        if (response.status === 1) {
          setShowComment(response.data);
        } else {
          // console.log("EEEE");
        }
      });
    });
  };

  const setPostC = () => {
    const obj = {
      method: "comment_post",
      post_id: id,
      comment: comment,
      user_id: user.data.user_id,
    };

    const objEdit = {
      method: "comment_post",
      post_id: id,
      comment: comment,
      comment_id: edCommId,
      user_id: user.data.user_id,
    };

    objEdit
      ? fetch(`${import.meta.env.VITE_API_URL}post`, {
        method: "POST",
        headers: {
          accept: "application/json",
          contentType: "application/json",
          version: "1.0.0",
          token: `Bearer ${token}`,
        },
        body: JSON.stringify(objEdit),
      }).then((res) => {
        res.json().then((response) => {
          if (response.status === 1) {
            setComment("");
            commentApi();
            setEdCommId("");
            // console.log("Comment EDIT MATE", response);
          }
        });
      })
      : fetch(`${import.meta.env.VITE_API_URL}post`, {
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
            setComment("");
            commentApi();
          }
        });
      });
  };

  const postEdit = () => {
    setEdtPostMenu(true);
  };
  const showReportPost = () => {
    setReport(!report);
  };

  const reportPost = (e: any) => {
    const obj = {
      method: "report_post",
      post_id: id,
      user_id: user.data.user_id,
      report: e,
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
            setReport(false);
          } else {
            setMessage(response.message);
          }
        });
      })
      .catch((e) => {
        setMessage(e);
      });
  };

  const conPostDelete = () => {
    setConformPostDelete(!conformPostDelete);
  };

  const likePost = () => {
    const obj = {
      method: "like_post",
      post_id: postData?.data?.post_id,
      user_id: user.data.user_id,
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
            setLikePostStatus(!likePostStatus);
          }
        });
      })
      .catch(() => {
        // console.log("Like Network issue...");
      });
  };

  const handleVideo = () => {
    if (playBool) {
      videoRef.current?.play();
      setPlayBool(false);
    } else {
      videoRef.current?.pause();
      setPlayBool(true);
    }
  };

  const handleToggleSound = () => {
    videoRef.current?.volume === 1
      ? (videoRef.current.volume = 0)
      : videoRef.current
        ? (videoRef.current.volume = 1)
        : null;
    setSoundBool((prevState) => !prevState);
  };

  return (
    <div className="CP-main">
      <div className="CP-close">
        {/* <AiOutlineClose onClick={() => back()} style={{ fontSize: "2rem" }} /> */}
      </div>

      <div className="uap-box d">
        <div>
          {postData ? (
            <>
              <div className="uap-img">
                {playBool ? (
                  <></>
                ) : (
                  // <BsFillPlayCircleFill
                  //   className="play-v"
                  //   onClick={handleVideo}
                  // />
                  <></>
                  // <BsPauseCircleFill
                  //   className="pause-v"
                  //   onClick={handleVideo}
                  // />
                )}
                {!soundBool ? (
                  <></>
                ) : (
                  // <HiVolumeUp className="on-v" onClick={handleToggleSound} />
                  <></>
                  // <HiVolumeOff className="off-v" onClick={handleToggleSound} />
                )}
                <video
                  className="uap-img"
                  autoPlay
                  style={{
                    objectFit: "cover",
                    width: "800px",
                    height: "500px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  ref={videoRef}
                  onClick={handleVideo}
                  onEnded={() => setPlayBool(false)}
                >
                  <source
                    src={imgSrc}
                    type="video/mp4"
                    style={{
                      objectFit: "cover",
                      width: "300px",
                      height: "300px",
                    }}
                  />
                </video>
              </div>
            </>
          ) : (
            <>
              <img src={DefaultImg} alt="img" className="uap-img" />
            </>
          )}
        </div>
        {/* =============================================================================== */}
        <div className="uap-box-comm">
          <div className="uap-comm-head">
            <div className="uap-comm-ic">
              {/* <div className="comment_header">
                <UserIcon
                  src={postData.data.photo}
                  popups={undefined}
                  popupval={undefined}
                  setPopupLike={undefined}
                  popupLike={undefined}
                  setPopupExplore={undefined}
                />
                <span style={{ marginLeft: "15px" }}>{postData.data.name}</span>
              </div>
              <div className="home-user-info d-f">
                <BiDotsHorizontalRounded style={{ cursor: "pointer" }} />
              </div> */}
              {postData ? (
                <>
                  <span>
                    {" "}
                    <UserIcon
                      src={postData.data.photo}
                      popups={undefined}
                      popupval={undefined}
                      setPopupLike={undefined}
                      popupLike={undefined}
                      setPopupExplore={undefined}
                    />
                  </span>
                  <span> {postData.data.name}</span>

                  {postData.data.user_id === user.data.user_id ? (
                    <>
                      <span style={{ cursor: "pointer" }}>
                        <img
                          src={MORE_ICON}
                          alt="more"
                          onClick={() => postEdit()}
                        />
                      </span>
                      {conformPostDelete ? (
                        <>
                          <span style={{ cursor: "pointer", color: "red" }}>
                            {/* <MdDelete onClick={() => conPostDelete()} /> */}
                          </span>
                          <DeleteConform
                            setConformPostDelete={setConformPostDelete}
                          />
                        </>
                      ) : (
                        <>
                          <span style={{ cursor: "pointer", color: "red" }}>
                            {/* <MdDelete onClick={() => conPostDelete()} /> */}
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {report ? (
                        <>
                          <span style={{ cursor: "pointer" }}>
                            {/* <FiAlertCircle onClick={() => showReportPost()} /> */}
                          </span>
                          <ReportPost
                            setReport={setReport}
                            message={message}
                            reportPost={reportPost}
                          />
                        </>
                      ) : (
                        <span
                          style={{ cursor: "pointer" }}
                          className="uap-re-ic"
                        >
                          {/* <FiAlertCircle onClick={() => showReportPost()} /> */}
                        </span>
                      )}
                    </>
                  )}
                  {edtPostMenu ? (
                    <EditPost
                      postData={postData}
                      setEdtPostMenu={setEdtPostMenu}
                    />
                  ) : null}
                </>
              ) : (
                <>
                  <span>
                    {" "}
                    <UserIcon
                      src={DEF_USER}
                      popups={undefined}
                      popupval={undefined}
                      setPopupLike={undefined}
                      popupLike={undefined}
                      setPopupExplore={undefined}
                    />{" "}
                  </span>
                  <span> User Name...</span>

                  <span className="uap-date"> Date</span>
                </>
              )}
              {/* <AiOutlineClose onClick={() => back()} style={{ fontSize: "2rem" }} /> */}
            </div>

            <div className="uap-comm-comments">
              {postData ? (
                <>
                  <div className="uap-show-comm">
                    <div className="uap-sh-card">
                      <div className="comment_header uap-c-n">
                        <UserIcon
                          src={postData.data.photo}
                          popups={undefined}
                          popupval={undefined}
                          setPopupLike={undefined}
                          popupLike={undefined}
                          setPopupExplore={undefined}
                        />
                        <span style={{ marginLeft: "15px" }}>
                          {postData.data.name}
                        </span>
                      </div>
                      <span className="uap-s-c">
                        <span>{postData.data.description}</span>
                      </span>
                    </div>
                    <div className="uap-sh-t">
                      <span className="uap-time">
                        {moment
                          .utc(`${postData.data.reg_date}`)
                          .local()
                          .startOf("seconds")
                          .fromNow()}
                      </span>
                    </div>
                  </div>

                  {showComment ? (
                    <>
                      {showComment.map((item, index) => {
                        return (
                          <ShowComm
                            item={item}
                            key={index}
                            pid={id}
                            dlCom={dlCom}
                            setComment={setComment}
                            setEdCommId={setEdCommId}
                            setDlCom={setDlCom}
                          />
                        );
                      })}
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
            <div className="uap-comm-foot">
              {postData ? (
                <>
                  <div className="uap-post-like">
                    {postData.data.is_liked === "1" ? (
                      <></>
                    ) : (
                      // <FcLike
                      //   className="ic-liked my-2.5"
                      //   onClick={() => likePost()}
                      // />
                      <img
                        src={Like}
                        className="ic my-2.5"
                        onClick={() => likePost()}
                        alt="hh"
                      />
                    )}
                    <img src={Chat} className="ic my-2.5" alt="hh" />
                    <img src={Send} className="ic my-2.5" alt="hh" />
                  </div>
                  <div className="uap-post-book">
                    {/* <VscBookmark className="ic-1 my-2.5" /> */}
                  </div>
                </>
              ) : null}
            </div>
            <div className="uap-comm-li">
              {postData ? (
                <>
                  {likePostStatus ? (
                    <span className="uap-p-like">
                      {" "}
                      {postData.data.likes} Likes
                    </span>
                  ) : (
                    <span className="uap-p-like">
                      {" "}
                      {postData.data.likes} Likes
                    </span>
                  )}
                  <span className="uap-text-num">
                    {comment.length > 249 && "MAX Length  "}
                    {comment.length}/250
                  </span>
                  <span className="uap-date">
                    {/* {moment.utc(`${postData.data.reg_date}`).local().startOf('seconds').fromNow()} */}
                    {moment.utc(`${postData.data.reg_date}`).fromNow()}
                  </span>
                </>
              ) : (
                <>
                  <span className="uap-p-like"> Likes</span>
                  <span className="uap-text-num"> 0/250 </span>
                  <span className="uap-date"> Time </span>
                </>
              )}
            </div>
            <div className="uap-comm-set-comm">
              <textarea
                className="uap-inp-cap"
                value={comment}
                id="cap"
                rows={15}
                onChange={checkLength}
                placeholder="Write Comment..."
                cols={29}
              />
              <span className="uap-p" onClick={() => setPostC()}>
                POST
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccountPostPreview;
