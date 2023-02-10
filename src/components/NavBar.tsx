import { useState, useRef, Fragment } from "react";
import { useSelector } from "react-redux";
import { UserIcon, Accountprofile, CreatePost } from "./";
import { Link, useNavigate, useParams } from "react-router-dom";

// import ScrollToTop from "react-scroll-to-top";
import {
  ADD_POST_ICON,
  BLACK_LOGO,
  HOME_ICON,
  MESSAGES_ICON,
  NOTIFICATION_ICON,
  SEARCH_ICON,
  TOP_ARROW,
  WALLET_INACTIVE,
} from "../assets";
import { useOnClickOutside } from "~/hooks";
import ScrollToTop from "react-scroll-to-top";

const NavBar = () => {
  const [popup, setPopup] = useState(false);
  const { user } = useSelector((state: any) => state.UserLogin);
  const { id } = useParams();
  const [popuplike, setPopupLike] = useState<boolean>(false);
  const [popupPost, setPopupPost] = useState<boolean>(false);
  const [/* popupExplore */, setPopupExplore] = useState<boolean>(false);
  const navigate = useNavigate();

  const postpop = () => {
    setPopupPost(!popupPost);
    setPopupLike(false);
    setPopup(false);
    setPopupExplore(false);
  };
  const goHome = () => navigate("/");

  const userMenuRef = useRef(null);
  const hideUserMenu = () => setPopup(false);
  useOnClickOutside(userMenuRef, hideUserMenu);

  return (
    <div className="nav-bar">
      <ScrollToTop smooth component={<div className="rounded-sm flex items-center flex-col"><img src={TOP_ARROW} className="w-7 h-5" alt="TOP_ARROW" /></div>} />
      <div className="nav-blur"></div>
      <Link to="/" className="nav-logo-div">
        <img src={BLACK_LOGO} className="nav-logo1" alt="hello" />
      </Link>
      <div className="nav-icons ">
        <div>
          <img
            src={HOME_ICON}
            alt="Home"
            className="navbar__icon"
            onClick={() => goHome()}
          />
        </div>
        <Link to="/discover">
          <img
            src={SEARCH_ICON}
            alt="Search"
            className="navbar__icon mr-2.5 ml-2.5"
          />
        </Link>
        <div>
          <img
            src={ADD_POST_ICON}
            alt="Post"
            className="navbar__icon mr-2.5 ml-2.5"
            onClick={() => postpop()}
          />
        </div>
        <Link to="/notification">
          <img
            src={NOTIFICATION_ICON}
            alt="Notification"
            className="navbar__icon mr-2.5 ml-2.5"
          />
        </Link>
        <Link to="/messages">
          <img
            src={MESSAGES_ICON}
            alt="Msg"
            className="navbar__icon mr-2.5 ml-2.5"
          />
        </Link>
        <Link className="nav-btn" to="/wallet">
          <img
            src={WALLET_INACTIVE}
            alt="Wallet"
            className="navbar__icon mr-2.5 ml-2.5"
          />
        </Link>
        {popupPost && (
          <CreatePost setPopupPost={setPopupPost} popupPost={popupPost} />
        )}

        <section ref={userMenuRef}>
          <UserIcon
            // className="mr ml-2.5"
            popups={setPopup}
            popupval={popup}
            setPopupLike={setPopupLike}
            popupLike={popuplike}
            src={user.data.photo}
            setPopupExplore={setPopupExplore}
          // style={{ cursor: "pointer" }}          
          />
          {popup && (
            <Accountprofile /* className="mr ml-2.5" */ setPopup={setPopup} />
          )}
        </section>
      </div>
    </div>
  );
};

export default NavBar;
