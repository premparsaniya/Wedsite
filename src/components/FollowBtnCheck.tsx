import React, { Fragment } from "react";
import { CLOSE_ICON, RIGHT_ICON } from "~/assets";
import { buttonCheck, FollowEnum } from "../functions";
import SpinningLoader from "./Animation/SpinningLoader";
import BTN from "./BTN";

type Props = {
  followBtnClick: any;
  user1: string;
  user2: string;
  userItem: object;
  loading: boolean,
  isDecibel: string,
};

const FollowBtnCheck = ({ followBtnClick, user1, user2, userItem, loading, isDecibel }: Props) => {
  var type = buttonCheck(user1, user2);

  return (
    <Fragment key={type} >
      {type == FollowEnum.typeFollow ? (
        <BTN disabled={isDecibel !== "" ? true : false} className="rounded-full py-2 px-7" onP={() => followBtnClick(type, "", userItem)} title={"Follow"} loading={loading} />
      ) : null}
      {type == FollowEnum.typeUnfollow ? (
        <BTN disabled={isDecibel !== "" ? true : false} className="rounded-full py-2 px-7" onP={() => followBtnClick(type, "", userItem)} title={"Unfollow"} loading={loading} />
      ) : null}
      {type == FollowEnum.typeFollowBack ? (
        <BTN disabled={isDecibel !== "" ? true : false} className="rounded-full py-2 px-7" onP={() => followBtnClick(type, "", userItem)} title={"Follow Back"} loading={loading} />
      ) : null}
      {type == FollowEnum.typeRequestSent ? (
        <BTN disabled={isDecibel !== "" ? true : false} className="rounded-full py-2 px-7" onP={() => followBtnClick(type, "", userItem)} title={"Pending"} loading={loading} />
      ) : null}
      {/* {type == FollowEnum.typeUnfollow ? <div className="user-follow" onClick={() => followBtnClick(type, "", userItem)}>Unfollow</div> : null} */}
      {type == FollowEnum.typeGotRequest ? (
        <div className="notification-btn ">
          <button
            className="notification-right cursor-pointer"
            onClick={() => followBtnClick(type, "accept", userItem)}
          >
            {
              loading ?
                <SpinningLoader isLoading={loading} className="ctr" />
                : <img src={RIGHT_ICON} alt="Right-icon" />
            }
          </button>
          <button
            className="notification-close cursor-pointer"
            onClick={() => followBtnClick(type, "reject", userItem)}
          >
            {
              loading ?
                <SpinningLoader isLoading={loading} className="ctr" />
                : <img src={CLOSE_ICON} alt="close-icon" />
            }
          </button>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FollowBtnCheck;
