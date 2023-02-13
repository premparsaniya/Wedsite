import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loading, UserIcon } from "../";
import { useNavigate, useParams } from "react-router-dom";
import { BACK_ICON, CLOSE_BLACK_ICON } from "~/assets";
import { App_state } from "~/reduxState";
import { toast } from "react-toastify";
import { setPostList } from "~/reduxState";


type Props = {
  setEdtPostMenu: (b: boolean) => void;
  edtPost?: boolean;
  postData: any;
  setPostPopup?: (b: boolean) => void;
  // onClose?: (b: boolean) => void
};

const EditPost = ({ setEdtPostMenu, postData, setPostPopup = () => { }, /* onClose = () => { } */ }: Props) => {

  const dispatch = useDispatch();
  const { id } = useParams();
  const { user } = useSelector((state: App_state) => state?.UserLogin);
  const navigate = useNavigate();
  const [caption, setCaption] = useState<string>(postData?.description || "");
  const [title, setTitle] = useState<string>(postData?.title || "");
  const [image, setImage] = useState<string>(postData?.att_thumb);
  const [loading, setLoading] = useState<boolean>(false);

  const [videoData, setVideoData] = useState<string>(postData?.attachment);
  const [imgPreviewUrl, setImgPreviewUrl] = useState<string | ArrayBuffer | null
  >(postData?.attachment);

  const token = user?.token;
  const checkLength = (e: any) => {
    e.target.value.length < 251 && setCaption(e.target.value);
  };

  const generateVideoThumbnail = (file: File) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");

      // this is important
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        let ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();
        // return resolve(canvas.toDataURL("image/jpg"));
        canvas.toBlob((blob) => {
          const file = new File([blob || ""], "thumbnail.jpg", {
            type: "image/jpg",
            lastModified: Date.now(),
          });
          return resolve(file);
        }, "image/jpg");
      };
    });
  };

  const getVideoDuration = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const media = new Audio(reader.result as string);
        media.onloadedmetadata = () => resolve(media.duration);
      };
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e: any) => {
    // e.preventDefault();
    // let reader = new FileReader();
    // let file = e.target.files[0];
    // reader.onloadend = () => {
    //   setImage(file);
    //   setImgPreviewUrl(reader.result);
    // };
    // reader.readAsDataURL(file);


    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    let fileSize = Math.ceil(file.size / 1024 / 1024)

    const duration = (await getVideoDuration(e.target.files[0]) as number);

    if (fileSize >= 20) {
      toast.error("please select video less then 20mb", {
        position: "top-center",
      });
      e.target.value = "";
      setVideoData("");
      setImgPreviewUrl("");
      setImage("");
    }
    if (duration >= 60) {
      toast.error("please select video less then 60 seconds", {
        position: "top-center",
      });
      e.target.value = "";
      setVideoData("");
      setImgPreviewUrl("");
      setImage("");
    }
    else {
      reader.onloadend = () => {
        setVideoData(file);
        setImgPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      const thumbnail = (await generateVideoThumbnail(
        e.target.files[0]
      )) as string;
      setImage(thumbnail);
    }

  };
  const closeImg = () => {
    setImage("");
    setImgPreviewUrl("");
  };

  const back = () => {
    setEdtPostMenu(false);
  };
  // useEffect(() => {
  //   setTitle(postData?.title);
  //   setCaption(postData?.description);
  //   setImage(postData?.attachment);
  //   setImgPreviewUrl(postData?.attachment);
  // }, []);


  const setEdPost = () => {

    // setPostPopup(false)
    setLoading(true)
    const formDataNew = new FormData();
    formDataNew.append("method", "set_post");
    formDataNew.append("attachments[0]", videoData);
    formDataNew.append("att_thumb[0]", image);
    postData?.attachment !== videoData && formDataNew.append("previous_attachments[0]", postData?.attachment_id)
    postData?.attachment !== videoData && formDataNew.append("removed_attachments[0]", postData?.attachment_id)
    formDataNew.append("title", title);
    formDataNew.append("post_id", postData?.post_id || "");
    formDataNew.append("description", caption);
    formDataNew.append("user_id", user?.data.user_id);

    fetch(`${import.meta.env.VITE_PUBLIC_URL}post`, {
      method: "POST",
      headers: {
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: formDataNew,
    })
      .then((result) => {
        result.json().then((response) => {
          if (response.status === 1) {
            setEdtPostMenu(false);
            fetchPostData();
            setPostPopup(false)
            setLoading(false)
            // onClose(false)
            id && navigate(-1)
            toast.success("post edited successfully...", { position: "top-center", autoClose: 1000 });
          } else {
            setLoading(false)
            setEdtPostMenu(false);
            toast.error("action failed", {
              position: "top-center",
            });
          }
        });
      })
      .catch((err) => {
        // console.error("ERRORRR", err);
      });
  };

  const fetchPostData = () => {
    const obj = {
      method: "get_post_list",
      page: 1,
      limit: 10,
      user_id: user.data.user_id,
      user_2: id,
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
    }).then((result) => {
      result.json().then((response) => {
        if (response.status === 1) {
          dispatch(setPostList(response?.data));
        }
      });
    });
  };

  return (
    <>
      <div className="CP-main">
        {
          loading ? <div className="w-full h-[100%] flex justify-center items-center">
            <Loading />
          </div> :
            <div className="CP-box ">
              <div className="CP-New ">
                <div className="CP-Arrow d-f">
                  <img src={BACK_ICON} alt="back" onClick={() => back()} />
                </div>
                <div className="CP-Text">
                  <span>Edit post</span>
                </div>
                <div className="CP-Share d-f">
                  <button className="CP-POST" onClick={() => setEdPost()}>
                    DONE
                  </button>
                </div>
              </div>

              <div className="cp-data ">
                <div className="cp-img d-f">
                  {imgPreviewUrl ? (
                    <video width="100%" height="100%" autoPlay crossOrigin="anonymous" >
                      <source src={imgPreviewUrl as string} type="video/mp4" />
                    </video>
                    // <img
                    //   src={imgPreviewUrl as string}
                    //   style={{
                    //     height: "750px",
                    //     width: "798px",
                    //     objectFit: "contain",
                    //   }}
                    //   alt="image Selected"
                    // />
                  ) : (
                    <>
                      <input
                        className="cp-sel-img"
                        type="file"
                        accept=".mp4"
                        onChange={handleImageChange}
                      />
                    </>
                  )}
                  {imgPreviewUrl ? (
                    // <div className="cp-close-img">
                    <img
                      src={CLOSE_BLACK_ICON}
                      alt="Close"
                      className="absolute top-0 right-0 bg-black p-2 rounded-bl-3xl bg-opacity-30"
                      onClick={() => closeImg()}
                    />
                    // </div>
                  ) : null}
                </div>

                <div className="cp-caption ">
                  <div className="cp-u ">
                    {/* <div className="cp-UIcon"><UserIcon /></div> */}
                    <div className="cp-UIcon">
                      <UserIcon
                        src={user.data.photo}
                        popups={undefined}
                        popupval={undefined}
                        setPopupLike={undefined}
                        popupLike={undefined}
                        setPopupExplore={undefined}
                      />
                    </div>
                    <div className="cp-UName">{user.data.name}</div>
                  </div>

                  <div className="cp-title d-f">
                    <input
                      type="text"
                      className="cp-inp-title"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="cp-cap d-f">
                    <textarea
                      className="cp-inp-cap"
                      value={caption}
                      id="cap"
                      rows={15}
                      onChange={checkLength}
                      placeholder="Write The Caption..."
                      cols={29}
                    />
                    <div className="cp-text-num">
                      {caption.length > 249 && "MAX Length  "}
                      {caption.length}/250
                    </div>
                  </div>

                  <div className="cp-title d-f"></div>
                </div>
              </div>
            </div>
        }
      </div>
    </>
  );
};

export default EditPost;
