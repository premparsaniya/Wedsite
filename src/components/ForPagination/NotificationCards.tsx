import moment from "moment";
import { forwardRef, Fragment } from "react";
import { useSelector } from "react-redux";
import { CLOSE_ICON, RIGHT_ICON } from "~/assets";
import { DEF_USER } from "~/assets";
import SpinningLoader from "../Animation/SpinningLoader";
import 'moment-timezone';
type Props = {
    item: any;
    index: number;
    rLoading: boolean;
    aLoading: boolean;
    goProfile: (n: number) => void;
    acceptRequest: (s: string) => void;
    rejectRequest: (s: string) => void;
};

const NotificationCards = forwardRef(({ item, index, aLoading, rLoading, goProfile, acceptRequest, rejectRequest }: Props, ref: any) => {

    const { user } = useSelector((state: any) => state.UserLogin);

    const postCardBody = (
        <Fragment key={index}>
            <div className="notification-follow-list-box ">
                <div className="notification-follow-list">
                    <img
                        src={item?.sender?.photo || DEF_USER}
                        alt="Profile"
                        className="profile-size cursor-pointer"
                        style={{ marginLeft: "10px" }}
                        onClick={() => goProfile(item?.sender?.user_id)}
                        crossOrigin="anonymous"
                    />
                    <div className="notification-flex">
                        <div className="user_name cursor-pointer">
                            <span onClick={() => goProfile(item?.sender?.user_id)}>
                                {item?.sender?.name}
                                <span className="text-sm text-gray-400 ml-1">
                                    {item?.notification}
                                </span>
                            </span>
                            <span className="notification-font">                           
                                    {moment.tz(item?.reg_date, 'MET').startOf(item?.reg_date).fromNow()}
                            </span>
                        </div>
                        {user?.data?.settings?.profile === "0" &&
                            item?.slug === "follow_request" ? (
                            <div className="notification-btn">
                                <div
                                    className="notification-right"
                                    onClick={() => acceptRequest(item?.sender?.user_id)}
                                >
                                    {aLoading ? (
                                        <SpinningLoader
                                            isLoading={aLoading}
                                            className="ctr"
                                        />
                                    ) : (
                                        <img
                                            src={RIGHT_ICON}
                                            alt="Right-icon"
                                            className="cursor-pointer"
                                        />
                                    )}
                                </div>
                                <div
                                    className="notification-close"
                                    onClick={() => rejectRequest(item?.sender?.user_id)}
                                >
                                    {rLoading ? (
                                        <SpinningLoader
                                            isLoading={rLoading}
                                            className="ctr"
                                        />
                                    ) : (
                                        <img
                                            src={CLOSE_ICON}
                                            alt="close-icon"
                                            className="cursor-pointer"
                                        />
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
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

export default NotificationCards