import { NavLink, useParams } from "react-router-dom";
import {
  BLOCK_ICON,
  BOOKMARK_ICON,
  CLOSE_IC,
  DELETE_ICON,
  EYE_OFF,
  INFO_ICON,
  PASSWORD_ICON,
  PROFILE_SETTING,
  SETTING_ICON,
} from "../assets";

type Props = {
  handleFunction: any;
};
const MenuPopup = ({ handleFunction }: Props) => {
  let activeStyle = {
    textDecoration: "none",
    borderLeft: "3px solid #000",
    color: "black",
    // color: 'red',
    height: "60px",
    paddingLeft: "30px",
    display: "flex",
    fontSize: "1.5rem",
    alignItems: "center",
  };
  let notactiveStyle = {
    textDecoration: "none",
    height: "60px",
    paddingLeft: "30px",
    display: "flex",
    alignItems: "center",
    color: "black",
    fontSize: "1.5rem",
  };

  const { id } = useParams();

  return (
    <div className="main-menu-popup">
      {/* <img src={UP_ARROW} className="menu-popup-arrow" alt="hhh" /> */}
      <div className="menu-popup-contain">
        <div className="menu-popup-close-div">
          <img
            src={CLOSE_IC}
            alt="close"
            className="object-contain w-5 h-5 menu-popup-close"
            onClick={handleFunction}
          />
        </div>
        <div>
          <NavLink
            to={`/uapp/ep/${id}/${"gen"}`}
            style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
            onClick={handleFunction}
          >
            <img
              src={PROFILE_SETTING}
              alt="EMOJI_ICON"
              className="menu-popup-menu-icon"
            />{" "}
            <span className="menu-popup-title">Edit Profile</span>
          </NavLink>
        </div>
        <div>
          <NavLink
            to={`/uapp/ep/${id}/${"cp"}`}
            style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
            onClick={handleFunction}
          >
            <img
              src={PASSWORD_ICON}
              alt="EMOJI_ICON"
              className="menu-popup-menu-icon"
            />
            <span className="menu-popup-title">Change Password</span>
          </NavLink>
        </div>
        <div>
          <NavLink
            to={`/uapp/ep/${id}/${"settings"}`}
            style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
            onClick={handleFunction}
          >
            <img
              src={SETTING_ICON}
              alt="EMOJI_ICON"
              className="menu-popup-menu-icon"
            />
            <span className="menu-popup-title">Settings</span>
          </NavLink>
        </div>
        <div>
          <NavLink
            to={`/ep/${id}/${"sb"}`}
            style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
            onClick={handleFunction}
          >
            <img
              src={BOOKMARK_ICON}
              alt="EMOJI_ICON"
              className="menu-popup-menu-icon"
            />
            <span className="menu-popup-title">Save Bookmark</span>
          </NavLink>
        </div>
        <div>
          <NavLink
            to={`/${id}/${"hp"}`}
            style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
            onClick={handleFunction}
          >
            <img
              src={EYE_OFF}
              alt="EMOJI_ICON"
              className="menu-popup-menu-icon"
            />
            <span className="menu-popup-title">Hidden Post</span>
          </NavLink>
        </div>
        <div>
          <NavLink
            to={`/uapp/ep/${id}/${"bu"}`}
            style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
            onClick={handleFunction}
          >
            <img
              src={BLOCK_ICON}
              alt="EMOJI_ICON"
              className="menu-popup-menu-icon"
            />
            <span className="menu-popup-title">Blocked Users</span>
          </NavLink>
        </div>
        <div>
          <NavLink
            to={`/uapp/ep/${id}/${"da"}`}
            style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
            onClick={handleFunction}
          >
            <img
              src={DELETE_ICON}
              alt="EMOJI_ICON"
              className="menu-popup-menu-icon"
            />
            <span className="menu-popup-title">Delete Account</span>
          </NavLink>
        </div>
        <div>
          <NavLink
            to={`/uapp/ep/${id}/${"pp"}`}
            style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
            onClick={handleFunction}
          >
            <img
              src={PASSWORD_ICON}
              alt="EMOJI_ICON"
              className="menu-popup-menu-icon"
            />
            <span className="menu-popup-title">Privacy Policy</span>
          </NavLink>
        </div>
        <div>
          <NavLink
            to={`/uapp/ep/${id}/${"au"}`}
            style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
            onClick={handleFunction}
          >
            <img
              src={INFO_ICON}
              alt="EMOJI_ICON"
              className="menu-popup-menu-icon"
            />
            <span className="menu-popup-title">About Us</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MenuPopup;
