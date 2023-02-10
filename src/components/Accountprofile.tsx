import { LOG_OUT_ICON, UP_ARROW } from "~/assets";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser, LogoutUserPost } from "../reduxState/action";
import { PROFILE_BLACK_ICON, SEND_ICON, SETTING_BLACK_ICON } from "~/assets";
import { AppContext, resetUser } from "~/context";
import { useContext } from "react";

type props = {
  setPopup: any;
};
const Accountprofile = ({ setPopup }: props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.UserLogin);
  const { dispatch: disp } = useContext(AppContext);

  const GoLogout = () => {
    dispatch(LogoutUser());
    dispatch(LogoutUserPost());
    navigate("/");
    resetUser(disp);
  };
  const goSettings = () => {
    navigate(`/uapp/ep/${user.data.user_id}/${"gen"}`);
    setPopup(false);
  };
  const goProfile = () => {
    navigate(`/userprofile/${user.data.user_id}`);
    setPopup(false);
  };
  return (
    <div className="acc-box" onClick={() => setPopup(false)}>
      <img src={UP_ARROW} className="acc-arrow" alt="img" />
      <div className="acc-box-in">
        <div
          className="acc-row1 "
          style={{ cursor: "pointer" }}
          onClick={() => goProfile()}
        >
          <p className="acc-col1">
            <img src={PROFILE_BLACK_ICON} alt="Profile" />
          </p>
          <p className="acc-col2">Profile</p>
        </div>
        <div className="acc-row1 " style={{ cursor: "pointer" }}>
          <img className="acc-col1 save" src={SEND_ICON} alt="img" />

          <p className="acc-col2"> Share profile </p>
        </div>
        <div
          className="acc-row1 "
          style={{ cursor: "pointer" }}
          onClick={() => goSettings()}
        >
          <p className="acc-col1">
            <img src={SETTING_BLACK_ICON} alt="Setting" />
          </p>
          <p className="acc-col2">Settings</p>
        </div>
        <div
          className="acc-row1 acc-row1-border "
          style={{ cursor: "pointer" }}
          onClick={() => GoLogout()}
        >
          <img className="acc-col1 save" src={LOG_OUT_ICON} alt="img" />
          <p className="acc-col2">Logout</p>
        </div>
      </div>
    </div>
  );
};

export default Accountprofile;
