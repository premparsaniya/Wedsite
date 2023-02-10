import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {/*  EMOJI_ICON, */ SETTING_BLACK_ICON } from "../assets";
import {
  EdProfile,
  CngPassword,
  EditMenu,
  Settings,
  MenuPopup,
} from "../components";

import AboutUs from "./AboutUs";
import BlockUsers from "./BlockUsers";
import DeleteAccount from "./DeleteAccount";
import HiddenPost from "./HiddenPost";
import PrivacyPolicy from "./PrivacyPolicy";
import SaveBookMark from "./SaveBookMark";

const EditUProfile = () => {
  const { general } = useParams();

  const [menuPopup, setMenuPopup] = useState<boolean>(false);

  const handleMenuPopup = () => {
    setMenuPopup(!menuPopup);
  };

  return (
    <>
      <div
        className="flex  ml-1  border border-black mt-20 sm:hidden"
        onClick={handleMenuPopup}
      >
        <img
          src={SETTING_BLACK_ICON}
          alt="EMOJI_ICON"
          className="main-menu-icon mt-1.5 ml-1.5"
        />
        <span className=" ml-2 border  border-black"></span>
        <span className="text-black font-bold ml-2 p-2 text-base">Setting</span>
      </div>
      {menuPopup && <MenuPopup handleFunction={handleMenuPopup} />}
      <div className="edup-main">
        <div className="edup-box">
          <EditMenu />
          {general === "gen" ? <EdProfile /> : null}
          {general === "cp" ? <CngPassword /> : null}
          {general === "settings" ? <Settings /> : null}
          {general === "sb" ? <SaveBookMark /> : null}
          {general === "hp" ? <HiddenPost /> : null}
          {general === "bu" ? <BlockUsers /> : null}
          {general === "da" ? <DeleteAccount /> : null}
          {general === "pp" ? <PrivacyPolicy /> : null}
          {general === "au" ? <AboutUs /> : null}
        </div>
      </div>
    </>
  );
};

export default EditUProfile;
