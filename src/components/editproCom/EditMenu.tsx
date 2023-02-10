import { NavLink, useParams } from "react-router-dom";
import {
  BLOCK_ICON,
  BOOKMARK_ICON,
  DELETE_ICON,
  EYE_OFF,
  INFO_ICON,
  PASSWORD_ICON,
  PROFILE_SETTING,
  SETTING_ICON,
} from "../../assets";
const EditMenu = () => {
  let activeStyle = {
    textDecoration: "none",
    borderLeft: "3px solid #000",
    color: "black",
    // color: 'red',
    height: "60px",
    paddingLeft: "26px",
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
    fontSize: "1.4rem",
  };
  const { id } = useParams();
  return (
    <div className="edup-menus">
      <div>
        <NavLink
          to={`/uapp/ep/${id}/${"gen"}`}
          style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
        >
          <img
            src={PROFILE_SETTING}
            alt="EMOJI_ICON"
            className="edit-menu-icon"
          />{" "}
          <span>Edit Profile</span>
        </NavLink>
      </div>
      <div>
        <NavLink
          to={`/uapp/ep/${id}/${"cp"}`}
          style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
        >
          <img
            src={PASSWORD_ICON}
            alt="EMOJI_ICON"
            className="edit-menu-icon"
          />
          <span>Change Password</span>
        </NavLink>
      </div>
      <div>
        <NavLink
          to={`/uapp/ep/${id}/${"settings"}`}
          style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
        >
          <img src={SETTING_ICON} alt="EMOJI_ICON" className="edit-menu-icon" />
          <span>Settings</span>
        </NavLink>
      </div>
      <div>
        <NavLink
          to={`/ep/${id}/${"sb"}`}
          style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
        >
          <img
            src={BOOKMARK_ICON}
            alt="EMOJI_ICON"
            className="edit-menu-icon"
          />
          <span>Save Bookmark</span>
        </NavLink>
      </div>
      <div>
        <NavLink
          to={`/${id}/${"hp"}`}
          style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
        >
          <img src={EYE_OFF} alt="EMOJI_ICON" className="edit-menu-icon" />
          <span>Hidden Post</span>
        </NavLink>
      </div>
      <div>
        <NavLink
          to={`/uapp/ep/${id}/${"bu"}`}
          style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
        >
          <img src={BLOCK_ICON} alt="EMOJI_ICON" className="edit-menu-icon" />
          <span>Blocked Users</span>
        </NavLink>
      </div>
      <div>
        <NavLink
          to={`/uapp/ep/${id}/${"da"}`}
          style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
        >
          <img src={DELETE_ICON} alt="EMOJI_ICON" className="edit-menu-icon" />
          <span>Delete Account</span>
        </NavLink>
      </div>
      <div>
        <NavLink
          to={`/uapp/ep/${id}/${"pp"}`}
          style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
        >
          <img
            src={PASSWORD_ICON}
            alt="EMOJI_ICON"
            className="edit-menu-icon"
          />
          <span>Privacy Policy</span>
        </NavLink>
      </div>
      <div>
        <NavLink
          to={`/uapp/ep/${id}/${"au"}`}
          style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
        >
          <img src={INFO_ICON} alt="EMOJI_ICON" className="edit-menu-icon" />
          <span>About Us</span>
        </NavLink>
      </div>
      {/* <div>
        <NavLink
          to={`/uapp/ep/${id}/${"cp"}`}
          style={({ isActive }) => (isActive ? activeStyle : notactiveStyle)}
        >
          <img src={EMOJI_ICON} alt="EMOJI_ICON" className="edit-menu-icon" /><span>Log Out</span>
        </NavLink>
      </div> */}
    </div>
  );
};

export default EditMenu;
