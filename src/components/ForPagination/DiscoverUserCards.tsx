import { forwardRef, useState } from "react";
import { useSelector } from "react-redux";
import { DEF_USER } from "~/assets/";
import { FollowEnum } from "~/functions";
import FollowBtnCheck from "../FollowBtnCheck";

type Props = {
    item: any;
    index: number;
    // loading: boolean,
    userData: any[],
    isDecibel: string,
    setUserData: ([]: any) => void,
    goProfile: (n: number) => void,
    setIsDecibel: (s: string) => void,
};

const DiscoverUserCards = forwardRef(({ item, index, isDecibel, userData, goProfile, setUserData, setIsDecibel }: Props, ref: any) => {

    const { user } = useSelector((state: any) => state.UserLogin);
    const token = user?.token;

    const [btnLoading, setBtnLoading] = useState<boolean>(false);

    const followBtnClick = (type: FollowEnum, action: string, userItem: any) => {
        // console.log("")
        if (type == FollowEnum.typeFollow) {
            setBtnLoading(true)
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
                        setBtnLoading(false)
                        setIsDecibel("")
                        let newPostData = [...userData];
                        let idx = newPostData.findIndex(
                            (obj: any) => obj?.user_id === userItem?.user_id
                        );
                        newPostData[idx] = {
                            ...userItem,
                            user_1_follow_request: response?.extra?.user_1_follow_request,
                            user_2_follow_request: response?.extra?.user_2_follow_request,
                        };
                        setUserData(newPostData);
                        // getAllUsers();
                    } else {
                        setBtnLoading(false)
                        setIsDecibel("")
                    }
                });
            });
        } else if (type == FollowEnum.typeUnfollow) {
            // UN FOLLOW
            setBtnLoading(true)
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
                        // console.log(response);
                        setBtnLoading(false)
                        setIsDecibel("")
                        let newPostData = [...userData];
                        let idx = newPostData.findIndex(
                            (obj: any) => obj?.user_id === userItem?.user_id
                        );
                        newPostData[idx] = {
                            ...userItem,
                            user_1_follow_request: response?.extra?.user_1_follow_request,
                            user_2_follow_request: response?.extra?.user_2_follow_request,
                        };
                        setUserData(newPostData);

                        // getAllUsers();
                    } else {
                        setBtnLoading(false)
                        setIsDecibel("")
                        // console.log("else", response);
                    }
                });
            });
        } else if (type == FollowEnum.typeFollowBack) {
            // FOLLOW BACK
            setBtnLoading(true)
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
                        // console.log(response);
                        setBtnLoading(false)
                        setIsDecibel("")
                        let newPostData = [...userData];
                        let idx = newPostData.findIndex(
                            (obj: any) => obj?.user_id === userItem?.user_id
                        );
                        newPostData[idx] = {
                            ...userItem,
                            user_1_follow_request: response?.extra?.user_1_follow_request,
                            user_2_follow_request: response?.extra?.user_2_follow_request,
                        };
                        setUserData(newPostData);

                        // getAllUsers();
                    } else {
                        setBtnLoading(false)
                        setIsDecibel("")
                        // console.log("else", response);
                    }
                });
            });
        } else if (type == FollowEnum.typeRequestSent) {
            // REQUEST SENT
            setBtnLoading(true)
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
                        setBtnLoading(false)
                        setIsDecibel("")
                        // console.log(response);
                        let newPostData = [...userData];
                        let idx = newPostData.findIndex(
                            (obj: any) => obj?.user_id === userItem?.user_id
                        );
                        newPostData[idx] = {
                            ...userItem,
                            user_1_follow_request: response?.extra?.user_1_follow_request,
                            user_2_follow_request: response?.extra?.user_2_follow_request,
                        };
                        setUserData(newPostData);

                        // getAllUsers();
                    } else {
                        setBtnLoading(false)
                        setIsDecibel("")
                        // console.log("else", response);
                    }
                });
            });
        } else if (type == FollowEnum.typeGotRequest) {
            // ACCEPT / REJECT REQUESRT
            setBtnLoading(true)
            setIsDecibel(userItem?.user_id)
            if (action === "accept") {                
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
                            // console.log(response);
                            setBtnLoading(false)
                            setIsDecibel("")
                            let newPostData = [...userData];
                            let idx = newPostData.findIndex(
                                (obj: any) => obj?.user_id === userItem?.user_id
                            );
                            newPostData[idx] = {
                                ...userItem,
                                user_1_follow_request: response?.extra?.user_1_follow_request,
                                user_2_follow_request: response?.extra?.user_2_follow_request,
                            };
                            setUserData(newPostData);

                            // getAllUsers();
                        } else {
                            setBtnLoading(false)
                            setIsDecibel("")
                            // console.log("else", response);
                        }
                    });
                });
            } else {
                setBtnLoading(true)
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
                            setBtnLoading(false)
                            setIsDecibel("")
                            // console.log(response);
                            let newPostData = [...userData];
                            let idx = newPostData.findIndex(
                                (obj: any) => obj?.user_id === userItem?.user_id
                            );
                            newPostData[idx] = {
                                ...userItem,
                                user_1_follow_request: response?.extra?.user_1_follow_request,
                                user_2_follow_request: response?.extra?.user_2_follow_request,
                            };
                            setUserData(newPostData);
                            // getAllUsers();
                        } else {
                            // console.log("else", response);
                            setBtnLoading(false)
                            setIsDecibel("")
                        }
                    });
                });
            }
        }
    };


    const postCardBody = (
        <div className="discover-follow-list-box" key={index} >
            <div className="discover-follow-list">
                <div className="discover-follow-list-flex" onClick={() => goProfile(item?.user_id)}>
                    <img
                        src={item?.photo || DEF_USER}
                        alt="Profile"
                        className="profile-size cursor-pointer"
                        crossOrigin="anonymous"
                    />
                    <div className="user_name cursor-pointer">{item?.name}</div>
                </div>
                <FollowBtnCheck
                    key={item}
                    followBtnClick={followBtnClick}
                    user1={item?.user_1_follow_request}
                    user2={item?.user_2_follow_request}
                    userItem={item}
                    loading={btnLoading}
                    isDecibel={isDecibel}
                />
            </div>
            <div className="discover-border-gray"></div>
        </div>
    );
    const content = ref ? (
        <div ref={ref}>{postCardBody}</div>
    ) : (
        <div>{postCardBody}</div>
    );
    return content;
});

export default DiscoverUserCards