import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { App_state } from '~/reduxState';
import EditPost from './comment/EditPost';
import PopUp from './PopUp';
import ReportPostBox from './ReportPostBox';
import { setPostList } from "~/reduxState";
import { useNavigate, useParams } from 'react-router-dom';

type Props = {
    value: any,
    postPopup: boolean,
    setPostPopup: (b: boolean) => void,
    chatPostID?: string,
    closeToggle?: (b: boolean) => void,
    setHandleGP?: (b: boolean) => void,
    handleGP?: boolean,
}
const OptionPopup = ({ value, postPopup, setPostPopup, chatPostID, closeToggle = () => false, setHandleGP = () => false, handleGP = false }: Props) => {

    const { user } = useSelector((state: App_state) => state.UserLogin);
    const postData = useSelector((s: App_state) => s.PostListReducer);
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate()
    // find post index in post list
    const postIndex = postData?.findIndex((post: any) => post.post_id === value?.post_id);
    const token = user?.token;

    const [loading, setLoading] = useState<boolean>(false)
    const [edtPost, setEdtPost] = useState<boolean>(false);
    const [delPost, setDelPost] = useState<boolean>(false);
    const [report, setReport] = useState<boolean>(false);
    const [hideP, setHideP] = useState<boolean>(false)
    const [blockUser, setBlockUser] = useState<boolean>(false)

    const handleEditPostPopup = () => {
        setEdtPost(!edtPost);
    }

    const handleDeletePostPopup = () => {
        setDelPost(!delPost)
    }

    const handleReportPost = () => {
        setReport(!report)
    }
    const handleHidePostPopup = () => {
        setHideP(!hideP)
    }
    const handleBlockUserPopup = () => {
        setBlockUser(!blockUser)
    }

    const handleDeletePost = () => {
        const obj = {
            method: "delete_post",
            post_id: value?.post_id || chatPostID,
        };
        setLoading(true)
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
                    setLoading(false)
                    setDelPost(!delPost)
                    setPostPopup(!postPopup);
                    closeToggle(false)
                    // getUserProfile(false)
                    setHandleGP(!handleGP)
                    !id && fetchPostData();
                    // chatPostID && navigate(-1);
                    toast.success("post deleted successfully...", { position: "top-center", autoClose: 1000 });
                } else {
                    // console.log("else", response);
                }
            });
        });
    }

    const handleHidePost = () => {
        const obj = {
            method: "hide_post",
            post_id: value?.post_id || chatPostID,
        };
        setLoading(true)
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
                    setLoading(false)
                    setHideP(!hideP)
                    setPostPopup(!postPopup);
                    closeToggle(false)
                    setHandleGP(!handleGP)
                    // getUserProfile(false)
                    !id && fetchPostData();
                    // chatPostID && navigate(-1);
                    toast.success("post hide successfully...", { position: "top-center", autoClose: 1000 });
                } else {
                    // console.log("else", response);
                }
            });
        });
    }

    const handleBlockUser = () => {
        const obj = {
            method: "block_user",
            blocked_user: value?.user_id,
        };
        setLoading(true)
        fetch(`${import.meta.env.VITE_PUBLIC_URL}user`, {
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
                    setBlockUser(!blockUser)
                    setPostPopup(!postPopup);
                    closeToggle(false)
                    setHandleGP(!handleGP)
                    // getUserProfile(false)
                    !id && fetchPostData();
                    id && navigate("/");
                    toast.success("user blocked successfully...", { position: "top-center", autoClose: 1000 });
                } else {
                    // console.log("else", response);
                }
            });
        });
    }

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
            <div className="op-main-div">
                <div className="op-contain">
                    {
                        user.data.user_id == value.user_id ? (<>
                            <div className="op-title-div" onClick={handleEditPostPopup}>
                                <span className='op-title' >Edit Post</span>
                            </div>
                            <div className="op-title-div" onClick={handleDeletePostPopup}>
                                <span className='op-title' >Delete Post</span>
                            </div></>) : (<>
                                <div className="op-title-div" onClick={handleReportPost}>
                                    <span className='op-title' >Report Post</span>
                                </div>
                                <div className="op-title-div" onClick={handleHidePostPopup}>
                                    <span className='op-title' >Hide Post</span>
                                </div>
                                <div className="op-title-div" onClick={handleBlockUserPopup}>
                                    <span className='op-title' >Block User</span>
                                </div>
                            </>)
                    }
                    <div className="op-close-div" onClick={() => setPostPopup(!postPopup)}>
                        <span className='op-title' >
                            Close
                        </span>
                    </div>
                </div>
            </div>
            {
                edtPost && <EditPost setPostPopup={setPostPopup} setEdtPostMenu={setEdtPost} /* edtPost={edtPost} */ postData={value} /* onClose={onClose} */ />
            }
            {
                delPost && < PopUp message="Are you sure want to delete this post ?" btnMsg={"Delete"} functionHandle={handleDeletePost} closePopup={handleDeletePostPopup} loading={loading} />
            }
            {
                report && <ReportPostBox postPopup={postPopup} setPostPopup={setPostPopup} value={value} setReport={setReport} report={report} />
            }
            {
                hideP && < PopUp message="Are you sure want to hide this post ?" btnMsg={"Hide"} functionHandle={handleHidePost} closePopup={handleHidePostPopup} loading={loading} />
            }
            {
                blockUser && < PopUp message="Are you sure want to block this user ?" btnMsg={"Block"} functionHandle={handleBlockUser} closePopup={handleBlockUserPopup} loading={loading} />
            }
        </>
    )
}

export default OptionPopup



