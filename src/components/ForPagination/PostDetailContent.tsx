import moment from "moment";
import { forwardRef, Fragment } from "react";
import { useSelector } from "react-redux";
import { DELETE_ICON } from "~/assets";
import { DEF_USER } from "~/assets";
import 'moment-timezone';

type Props = {
    item: any;
    index: number;
    viewStatus: string;
    sendPostClick: (i: object) => void
    goProfile: (n: number) => void
    deleteComment: (s: string) => void
};

const PostDetailContent = forwardRef(({ item, index, viewStatus, sendPostClick, goProfile, deleteComment }: Props, ref: any) => {
    const { user } = useSelector((state: any) => state.UserLogin);

    const postCardBody = (
        <Fragment key={index}>
            <div className="mt-5 h">
                <div
                    className="relative flex items-center "
                    onClick={
                        viewStatus === "share" ? () => sendPostClick(item) : () => null
                    }
                >
                    <img
                        className="object-cover w-10 h-10 rounded-full mb-2 cursor-pointer"
                        src={item.photo || DEF_USER}
                        alt="username"
                        onClick={() => goProfile(item?.user_id)}
                        crossOrigin="anonymous"
                    />
                    <div className="w-full" >


                        <div onClick={() => goProfile(item?.user_id)} className="flex items-center ">
                            <span className="block ml-5 font-medium text-gray-600 cursor-pointer">
                                {item?.name}
                            </span>
                            {viewStatus === "comment" ? (
                                <span className="block ml-5 text-xs text-gray-400 ">
                                    {moment.tz(item?.reg_date, 'MET').startOf(item?.reg_date).fromNow()}
                                </span>
                            ) : null}
                        </div>
                        {viewStatus === "comment" && (
                            <div className="flex justify-between">
                                <span className=" flex items-center px-5 break-all w-[100%]">
                                    {item.comment}
                                </span>
                                {user?.data?.user_id === item?.user_id ? (
                                    <img
                                        src={DELETE_ICON}
                                        alt="delete"
                                        onClick={() => deleteComment(item?.comment_id)}
                                        className="cursor-pointer"
                                        crossOrigin="anonymous"
                                    />
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>

                <div className="border border-gray-100 w-full mt-2 " />
            </div>
        </Fragment>
    );
    const content = ref ? (
        <div ref={ref}>{postCardBody}</div>
    ) : (
        <div>{postCardBody}</div>
    );
    return content;
});

export default PostDetailContent