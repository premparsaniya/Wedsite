import { forwardRef, Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { CLOSE_ICON, RIGHT_ICON } from "~/assets";
import { FollowEnum } from "~/functions";
import FollowBtnCheck from "../FollowBtnCheck";

import UserIcon from "../UserIcon";

type Props = {
  val: any;
  uid: any,
  index: number;
  result: any[],
  followingsCount: string,
  isDecibel: string,
  setResult: ([]: any) => void,
  goProfile: (n: string) => void;
  setFollowingsCount: (s: string) => void,
  setIsDecibel: (s: string) => void,
};

const FollowersContent = forwardRef(
  (
    {
      val,
      uid,
      index,
      result,
      followingsCount,
      isDecibel,
      goProfile,
      setResult,
      setFollowingsCount,
      setIsDecibel,
    }: Props,
    ref: any
  ) => {
    const { user } = useSelector((state: any) => state.UserLogin);
    const token = user?.token;

    const [loading, setLoading] = useState<boolean>(false);


    const followBtnClick = (type: FollowEnum, action: string, userItem: any) => {
      if (type == FollowEnum.typeFollow) {
        setLoading(true)
        setIsDecibel(userItem?.user_id)
        const obj = {
          method: "do_follow",
          user_id: user?.data?.user_id,
          user_2: userItem?.user_id,
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
              setIsDecibel("")
              setLoading(false)
              let newPostData = [...result];
              let idx = newPostData.findIndex(
                (obj: any) => obj?.user_id === userItem?.user_id
              );
              newPostData[idx] = {
                ...userItem,
                user_1_follow_request: response?.extra?.user_1_follow_request,
                user_2_follow_request: response?.extra?.user_2_follow_request,
              };
              setResult(newPostData);              
              if ((user?.data?.user_id === uid) && (response?.extra?.user_1_follow_request !== "pending")) {
                let followingData = parseInt(followingsCount) + 1;
                setFollowingsCount(`${followingData}`)
              }
            } else {
              setLoading(false)
              setIsDecibel("")
            }
          });
        });
      } else if (type == FollowEnum.typeUnfollow) {
        // UN FOLLOW
        setLoading(true)
        setIsDecibel(userItem?.user_id)
        const obj = {
          method: "unfollow",
          user_id: user?.data?.user_id,
          user_2: userItem?.user_id,
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
              setIsDecibel("")
              setLoading(false)
              let newPostData = [...result];
              let idx = newPostData.findIndex(
                (obj: any) => obj?.user_id === userItem?.user_id
              );
              newPostData[idx] = {
                ...userItem,
                user_1_follow_request: response?.extra?.user_1_follow_request,
                user_2_follow_request: response?.extra?.user_2_follow_request,
              };
              setResult(newPostData);
              if ((user?.data?.user_id === uid) && (response?.extra?.user_1_follow_request !== "pending")) {
                let followingData = parseInt(followingsCount) - 1;
                setFollowingsCount(`${followingData}`)
              }
              // getAllUsers();
            } else {
              setLoading(false)
              setIsDecibel("")
            }
          });
        });
      } else if (type == FollowEnum.typeFollowBack) {
        // FOLLOW BACK
        setLoading(true)
        setIsDecibel(userItem?.user_id)
        const obj = {
          method: "do_follow",
          user_id: user?.data?.user_id,
          user_2: userItem?.user_id,
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
              setLoading(false)
              setIsDecibel("")
              // console.log(response);
              let newPostData = [...result];
              let idx = newPostData.findIndex(
                (obj: any) => obj?.user_id === userItem?.user_id
              );
              newPostData[idx] = {
                ...userItem,
                user_1_follow_request: response?.extra?.user_1_follow_request,
                user_2_follow_request: response?.extra?.user_2_follow_request,
              };
              setResult(newPostData);
              if (user?.data?.user_id === uid) {
                let followingData = parseInt(followingsCount) + 1;
                setFollowingsCount(`${followingData}`)
              }
              // getAllUsers();
            } else {
              setLoading(false)
              setIsDecibel("")
            }
          });
        });
      } else if (type == FollowEnum.typeRequestSent) {
        // REQUEST SENT
        setLoading(true)
        setIsDecibel(userItem?.user_id)
        const obj = {
          method: "cancel_follow_request",
          user_id: user?.data?.user_id,
          user_2: userItem?.user_id,
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
              setLoading(false)
              setIsDecibel("")
              // console.log(response);
              let newPostData = [...result];
              let idx = newPostData.findIndex(
                (obj: any) => obj?.user_id === userItem?.user_id
              );
              newPostData[idx] = {
                ...userItem,
                user_1_follow_request: response?.extra?.user_1_follow_request,
                user_2_follow_request: response?.extra?.user_2_follow_request,
              };
              setResult(newPostData);

              // getAllUsers();
            } else {
              setLoading(false)
              setIsDecibel("")
            }
          });
        });
      } else if (type == FollowEnum.typeGotRequest) {
        // ACCEPT / REJECT REQUESRT
        if (action === "accept") {
          setLoading(true)
          setIsDecibel(userItem?.user_id)
          const obj = {
            method: "accept_follow_request",
            user_id: user?.data?.user_id,
            user_2: userItem?.user_id,
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
                setLoading(false)
                setIsDecibel("")
                // console.log(response);
                let newPostData = [...result];
                let idx = newPostData.findIndex(
                  (obj: any) => obj?.user_id === userItem?.user_id
                );
                newPostData[idx] = {
                  ...userItem,
                  user_1_follow_request: response?.extra?.user_1_follow_request,
                  user_2_follow_request: response?.extra?.user_2_follow_request,
                };
                setResult(newPostData);

                // getAllUsers();
              } else {
                setLoading(false)
                setIsDecibel("")
              }
            });
          });
        } else {
          setLoading(true)
          setIsDecibel(userItem?.user_id)
          const obj = {
            method: "reject_follow_request",
            user_id: user?.data?.user_id,
            user_2: userItem?.user_id,
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
                setLoading(false)
                setIsDecibel("")
                // console.log(response);
                let newPostData = [...result];
                let idx = newPostData.findIndex(
                  (obj: any) => obj?.user_id === userItem?.user_id
                );
                newPostData[idx] = {
                  ...userItem,
                  user_1_follow_request: response?.extra?.user_1_follow_request,
                  user_2_follow_request: response?.extra?.user_2_follow_request,
                };
                setResult(newPostData);
                // getAllUsers();
              } else {
                setLoading(false)
                setIsDecibel("")
              }
            });
          });
        }
      }
    };

    const postCardBody = (
      <Fragment key={index}>
        <div className="followers-component">
          <div
            className="followers-row1"
          >
            <span style={{ padding: "0px 10px 0px 0px" }} onClick={() => goProfile(val?.user_id)} >
              {" "}
              <UserIcon
                src={val.photo}
                popups={undefined}
                popupval={undefined}
                setPopupLike={undefined}
                popupLike={undefined}
                setPopupExplore={undefined}
              />
            </span>
            <span style={{ padding: "0px 10px 0px 5px" }} onClick={() => goProfile(val?.user_id)}>{val.name}</span>
          </div>
          {/* <div className="followers-row2 user-follow cursor-pointer"> */}
          <FollowBtnCheck
            followBtnClick={followBtnClick}
            user1={val?.user_1_follow_request}
            user2={val?.user_2_follow_request}
            userItem={val}
            loading={loading}
            isDecibel={isDecibel}
          />
          {/* </div> */}
        </div>
      </Fragment>
    );
    const content = ref ? (
      <div ref={ref}>{postCardBody}</div>
    ) : (
      <div>{postCardBody}</div>
    );
    return content;
  }
);

export default FollowersContent;
