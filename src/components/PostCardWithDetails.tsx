import React, { useState } from 'react'
import UserIcon from './UserIcon'
import { DEFAULT_IMG, WHITE_MORE_ICON } from "~/assets"
import { useSelector } from 'react-redux'
import PopUp from './PopUp'

type Props = {
    item: any
    getBookMarkList?: () => void,
    getHiddenPostList?: () => void,
}
const PostCardWithDetails = ({ item, getBookMarkList = () => { }, getHiddenPostList = () => { } }: Props) => {

    const { user } = useSelector((state: any) => state.UserLogin);
    const token = user?.token;

    const [bmToggle, setBMToggle] = useState<boolean>(false);
    const [optionToggle, setOptionToggle] = useState<boolean>(false);

    const setBookMark = () => {
        setBMToggle(true);
        const obj = {
            method: "set_bookmark_post",
            // action: "",
            post_id: item?.post_id,
            user_id: user?.data?.user_id,
        };
        fetch(`${import.meta.env.VITE_PUBLIC_URL}bookmark`, {
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
                    if (response?.status === 1) {
                        setBMToggle(false);
                        getBookMarkList();
                    }
                });
            })
            .catch((e) => {
                setBMToggle(false);                
            });
    };

    const handleHidePost = () => {
        const obj = {
            method: "hide_post",
            post_id: item?.post_id,
        };
        setBMToggle(true)
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
                    setBMToggle(false);
                    getHiddenPostList();
                } else {
                    setBMToggle(false);
                    // console.log("else", response);
                }
            });
        });
    }

    const handleOptionPopup = () => {
        setOptionToggle(!optionToggle)
    }
    return (
        <>
            <div className="pcwd-main">
                <div className="pcwd-content">
                    <img crossOrigin="anonymous" src={item.att_thumb || DEFAULT_IMG} alt="img" className='pcwd-img' />
                    <div className="pcwd-user-dp-div">
                        <UserIcon src={item.photo} popups={undefined} popupval={undefined} setPopupLike={undefined} popupLike={undefined} setPopupExplore={undefined} />
                        <div className="pcw-user-name-div">
                            <span className="pcw-user-name-span">{item.name}</span>
                            <span className="pcw-user-date-span">{item.reg_date}</span>
                        </div>
                        <div className="eye_bMark_icon">
                            <img
                                src={WHITE_MORE_ICON}
                                alt="send"
                                className="object-contain h-5 cursor-pointer w-6 "
                                onClick={() => handleOptionPopup()}                                
                            />

                        </div>
                    </div>
                </div>
            </div>
            {
                optionToggle &&
                <PopUp message={!item?.is_hidden ? "Are you sure want to unHide this post ?" : "Are you sure want to remove Bookmark ?"} btnMsg={!item?.is_hidden ? "Un Hide" : "Remove Bookmark"} functionHandle={!item?.is_hidden ? handleHidePost : setBookMark} closePopup={handleOptionPopup} loading={bmToggle} />
            }
        </>
    )
}

export default PostCardWithDetails