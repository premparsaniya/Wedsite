import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  BACK_ICON,
  CLOSE_BLACK_ICON,
  CLOSE_ICON,
  MUSIC_ICON,
  MUSIC_LIST_ICON,
  PAUSE_MUSIC_IC,
  PLAY_MUSIC_IC,
} from "~/assets";
import { UserIcon, Discard, Loading, BTN, SpinningLoader } from ".";
import { setPostList, App_state } from "~/reduxState";
import { useNavigate, useParams } from "react-router-dom";
// import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

// const ffmpeg = createFFmpeg({ log: true });

type props = {
  setPopupPost: any;
  popupPost: any;
};


function CreatePost({ setPopupPost, popupPost }: props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state: any) => state.UserLogin);
  // const pageNumber = useSelector((s: App_state) => s?.pageReducer);
  // const postData = useSelector((s: App_state) => s?.PostListReducer);x

  const [discard, setDiscard] = useState<boolean>(false);
  const [caption, setCaption] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [videoData, setVideoData] = useState<File>();
  const [imgPreviewUrl, setImgPreviewUrl] = useState<string /* | ArrayBuffer | null */>("");

  const [audioS, setAudioS] = useState<boolean>();
  const [audioList, setAudioList] = useState<any>([]);
  const [playAudio, setPlayAudio] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [AVLoading, setAVLoading] = useState<boolean>(false);
  const [playId, setPlayID] = useState<number>();
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [audioUrlBlob, setAudioUrlBlob] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const token = user?.token;

  // const [ready, setReady] = useState(false);


  const [convertedData, setConvertedData] = useState<any>(null)

  // async function load() { await ffmpeg.load(); setReady(true); }
  // useEffect(() => {
  //   ffmpeg.isLoaded() ? setReady(true) : load();
  // }, [])

  const checkLength = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.value.length < 251 && setCaption(e.target.value);
  };

  const discardTogle = () => {
    if (image !== "" || caption !== "" || videoData !== undefined) {
      setDiscard(!discard);
    } else {
      setPopupPost(false);
    }
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

  // ------------------ get video duration -------------------- 
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

  // ------------------ onChange for video -------------------- 
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      e.preventDefault();
      let reader = new FileReader();
      let file = e.target?.files[0];
      let fileSize = Math.ceil(file.size / 1024 / 1024);
      let extention = file.name.split('.').pop();
      let toLowerExt = extention?.toLocaleLowerCase();

      if (toLowerExt != "mp4") {
        toast.error("please select only MP4 video", {
          position: "top-center",
        });
        e.target.value = "";
        setVideoData(undefined);
        setImgPreviewUrl("");
        setImage("");
      } else {
        const duration = (await getVideoDuration(e.target.files[0]) as number);
        if ((fileSize >= 20)) {
          toast.error("please select video less then 20mb", {
            position: "top-center",
          });
          e.target.value = "";
          setVideoData(undefined);
          setImgPreviewUrl("");
          setImage("");
        }
        else if (duration >= 60) {
          toast.error("please select video less then 60 seconds", {
            position: "top-center",
          });
          e.target.value = "";
          setVideoData(undefined);
          setImgPreviewUrl("");
          setImage("");
        }
        else {
          reader.onloadend = () => {
            setVideoData(file);
            typeof reader.result === "string" && setImgPreviewUrl(reader.result);
          };
          reader.readAsDataURL(file);
          const thumbnail = (await generateVideoThumbnail(
            e.target.files[0]
          )) as string;
          setImage(thumbnail);
        }
      }
    }
  };

  // ---------------------- marge audio in video click -----------------------
  // console.log("audioUrlBlob", audioUrlBlob)

  // const mergeAudioAndVideo = async () => {
  //   setAVLoading(true);
  //   let width = (videoRef?.current?.clientWidth || 0);
  //   let height = (videoRef?.current?.clientHeight || 0);
  //   if ((videoRef?.current?.clientWidth || 0) < 720 || (videoRef?.current?.clientHeight || 0) < 720) {
  //     width = (videoRef?.current?.clientWidth || 0) * 2;
  //     height = (videoRef?.current?.clientHeight || 0) * 2;
  //   }

  //   ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(videoData || imgPreviewUrl));
  //   ffmpeg.FS('writeFile', 'audio.m4a', await fetchFile(audioUrlBlob));

  //   // change encoding format & make compatible for HEVC
  //   await ffmpeg.run('-i', 'video.mp4', '-stream_loop', '-1', '-i', 'audio.m4a', '-shortest', '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'libx264', '-c:a', 'aac', '-b:a', '192k', '-y', '-s', `${width}*${height}`, '-preset', 'ultrafast', 'output.mp4').then(() => {
  //     let data = ffmpeg.FS('readFile', 'output.mp4');
  //     setAVLoading(false);
  //     let file = new File([new Uint8Array(data.buffer)], 'output.mp4', { type: 'video/mp4' });
  //     setConvertedData(file);
  //     let reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onloadend = () => {
  //       typeof reader.result === "string" && setImgPreviewUrl(reader.result);
  //     };
  //   })
  //     .catch(() => {
  //       setAVLoading(false);
  //     });
  // }

  // ------------------- create post button click -------------------

  const crPost = async () => {
    if (videoData !== undefined) {
      setLoading(true);
      const formDataNew = new FormData();
      formDataNew.append("attachments[0]", convertedData || videoData);
      formDataNew.append("att_thumb[0]", image);
      formDataNew.append("method", "set_post");
      formDataNew.append("description", caption);
      formDataNew.append("user_id", user.data.user_id);

      await fetch(`${import.meta.env.VITE_PUBLIC_URL}post`, {
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
              setLoading(false);
              setPopupPost(!popupPost);
              fetchPostData();
              location.pathname !== "/" && navigate(`/userprofile/${user?.data?.user_id}`)
            } else {
              setLoading(false);
              setPopupPost(!popupPost);
              toast.error("action failed", {
                position: "top-center",
              });
            }
          });
        })
        .catch(() => {
          setLoading(false);
          setPopupPost(!popupPost);
          toast.error("action failed", {
            position: "top-center",
          });
        });
    };
  };

  // ------------------- close image click -------------------
  const closeImg = () => {
    setImage("");
    setVideoData(undefined);
    setImgPreviewUrl("");
    setAudioS(false);
  };

  // ------------------- get post list for update array of post list -------------------
  const fetchPostData = () => {
    const obj = id === undefined && location.pathname !== "/" ? {
      method: "get_post_list",
      page: 1,
      limit: 10,
      user_id: user.data.user_id,
      user_2: user.data.user_id,
    } : {
      method: "get_post_list",
      page: 1,
      limit: 10,
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
    }).then((result) => {
      result.json().then((response) => {
        if (response.status === 1) {
          dispatch(setPostList(response?.data));
          // if (pageNumber === 1) {
          // } else {
          //   let clone = [...postData];
          //   response?.data && clone.push(...response?.data);
          //   dispatch(setPostList(clone));
          // dispatch(setGetPostListToggle(true))
          // }
          // dispatch(setPostList(response?.data));
        }
      });
    });
  };

  // ------------------------ get files (audio)---------------------------------
  // const handleAudioScreen = () => {
  //   setAudioS(!audioS);
  //   const obj = {
  //     method: "get_files",
  //     limit: "10",
  //     page: "1",
  //   };
  //   fetch(`${import.meta.env.VITE_PUBLIC_URL}file`, {
  //     method: "POST",
  //     headers: {
  //       accept: "application/json",
  //       version: "1.0.0",
  //       token: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify(obj),
  //   }).then((res) => {
  //     res.json().then((response) => {
  //       if (response.status === 1) {
  //         setAudioList(response.data);
  //       } else {
  //         // console.log("else", response);          
  //       }
  //     });
  //   });
  // };

  // ---------------------- handle audio play - pause -------------------

  const handlePlayAudio = (item: any, updateTo: boolean) => {
    setPlayAudio(updateTo);
    if (updateTo) {
      if (item?.id === playId) {
        audioRef.current?.play();
      } else {
        // setAudioUrlBlob(item?.file)        
        setPlayID(item.id);
        setAudioUrl(item.file);
        setTimeout(() => audioRef.current?.play(), 500);
      }
    } else {
      audioRef.current?.pause();
    }
  };

  // --------- get info of video -------------------

  const getInfo = (e: any) => {
    // console.log("info -->", e)
  }
  const selectAudioClick = (item: any) => {
    setAudioUrlBlob(item?.file)
  }

  return (
    <div className="CP-main">
      {loading ? <div className="w-full h-[100%] flex justify-center items-center">
        <Loading />
      </div> :
        <div className="CP-box">
          <div className="CP-New ">
            <button className="CP-Arrow d-f" /* disabled={AVLoading} */ onClick={() => discardTogle()}>
              {discard ? (
                <>
                  <img
                    src={CLOSE_BLACK_ICON}
                    alt="Close"
                  />
                  <Discard setPopupPost={setPopupPost} setDiscard={setDiscard} discardToggle={discard} />
                </>
              ) : (
                <>
                  <img
                    src={CLOSE_BLACK_ICON}
                    alt="Close"
                  />
                </>
              )}
            </button>
            <div className="CP-Text">
              <span>Create a new post</span>
            </div>
            <div className="CP-Share d-f">
              <button className="CP-POST" disabled={AVLoading} onClick={() => crPost()}>
                POST
              </button>
            </div>
          </div>
          <div className="cp-data">
            <div className="cp-img d-f relative overflow-hidden">
              {
                AVLoading ? <SpinningLoader
                  isLoading
                  colClass="text-black"
                  size={10}
                  className="flex items-center justify-center w-full mb-4"
                /> :
                  <>
                    {imgPreviewUrl ? (
                      <>
                        <video crossOrigin="anonymous" className="h-[86vh] w-full object-contain max-h-[86vh]" ref={videoRef} autoPlay onLoadedMetadata={getInfo} src={imgPreviewUrl as string} >
                          {/* <source src={imgPreviewUrl as string} type="video/mp4" /> */}
                        </video>
                        {/* <img
                          src={MUSIC_LIST_ICON}
                          alt="MUSIC_LIST_ICON"
                          className="volume-btn"
                          onClick={handleAudioScreen} /> */}
                      </>
                    ) : (
                      <>
                        <input
                          className="cp-sel-img"
                          type="file"
                          accept=".mp4"
                          onChange={handleImageChange} />
                      </>
                    )}

                    {imgPreviewUrl ? (
                      // <div className="cp-close-img">
                      <img
                        src={CLOSE_ICON}
                        alt="Close"
                        className="absolute top-0 right-0 bg-black p-2 rounded-bl-3xl bg-opacity-30"
                        onClick={() => closeImg()} />
                    ) : // </div>
                      null}
                  </>
              }
            </div>

            <div className="cp-caption ">
              {audioS ? (
                <>
                  <div className="cp-audio-div">
                    <div className="cp-u">
                      <div className="cp-back-arr"/*  onClick={handleAudioScreen} */>
                        <img src={BACK_ICON} alt="back" />
                      </div>
                      <div className="cp-UName flex justify-between">
                        <span className="cp-audio-title">Select Audio </span>
                        <button className="add-audio mr-5 text-[18px] pr-2 pl-2 rounded-md" disabled={AVLoading} /* onClick={() => mergeAudioAndVideo()} */ > Add </button>
                      </div>
                    </div>
                    <div className="audio-listing-div">
                      {/* {audioList.map((value: any, index: number) => {
                        return (
                          <Fragment key={index}>
                            <div className={`audio-map-div px-6 cursor-pointer ${value?.file === audioUrlBlob ? 'bg-gray-100' : ""}`} onClick={() => selectAudioClick(value)} >
                              <img
                                src={MUSIC_ICON}
                                alt="music"
                                className="h-5 w-5 object-contain" />
                              <div className="audio-title-div">
                                <span>{value.name}</span>
                              </div>
                              <div className="audio-play-btn-dic">
                                {value.id == playId ? (
                                  playAudio ? (
                                    <img
                                      src={PAUSE_MUSIC_IC}
                                      alt="Pause"
                                      className="pause-audio"
                                      onClick={() => handlePlayAudio(value, false)} />
                                  ) : (
                                    <img
                                      src={PLAY_MUSIC_IC}
                                      alt="play"
                                      className="play-audio"
                                      onClick={() => handlePlayAudio(value, true)} />
                                  )
                                ) : (
                                  <img
                                    src={PLAY_MUSIC_IC}
                                    alt="play"
                                    className="play-audio"
                                    onClick={() => handlePlayAudio(value, true)} />
                                )}
                              </div>
                            </div>
                          </Fragment>
                        );
                      })} */}
                    </div>
                    {/* <audio crossOrigin="anonymous" ref={audioRef} src={audioUrl}>                  
                    </audio> */}
                  </div>
                </>
              ) : (
                <div style={{ width: "100%" }}>
                  <div className="cp-u ">
                    <div className="cp-UIcon">
                      <UserIcon
                        src={user.data.photo}
                        popups={undefined}
                        popupval={undefined}
                        setPopupLike={undefined}
                        popupLike={undefined}
                        setPopupExplore={undefined} />
                    </div>
                    <div className="cp-UName">{user.data.name}</div>
                  </div>
                  <div className="cp-cap d-f">
                    <textarea
                      className="cp-inp-cap"
                      value={caption}
                      id="cap"
                      rows={15}
                      onChange={checkLength}
                      placeholder="Write The Caption..."
                      cols={29} />
                    <div className="cp-text-num">
                      {caption.length > 249 && "MAX Length  "}
                      {caption.length}/250
                    </div>
                  </div>
                </div>
              )}
              {/* <div className="cp-title d-f"></div> */}
            </div>
          </div>
        </div>}
    </div>
  );
}

export default CreatePost;

