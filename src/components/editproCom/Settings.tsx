import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import BTN from "../BTN";

const Settings = () => {
  const { user } = useSelector((state: any) => state.UserLogin);
  const [checked, setChecked] = useState<boolean>(false);
  const [checkedNot, setCheckedNot] = useState<boolean>(false);
  const [checkedSound, setCheckedSound] = useState<boolean>(false);
  const { id } = useParams();
  const token = user?.token;
  const navigate = useNavigate();

  const handleChangeCheck = () => {
    setChecked(!checked);
  };
  const handleChangeCheckNot = () => {
    setCheckedNot(!checkedNot);
  };

  const handleChangeCheckSound = () => {
    setCheckedSound(!checkedSound);
  };

  const setSettings = () => {
    const obj = {
      method: "set_user_settings",
      user_id: user.data.user_id,
      profile: checked === true ? "0" : "1",
      notification: checkedNot === true ? "1" : "0",
    };
    fetch(`${import.meta.env.VITE_PUBLIC_URL}profile`, {
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
          navigate(`/uapp/ep/${id}/${"gen"}`);
          // console.log("ressssss", response);
          // convertResponse(response.data)
        } else {
          // console.log("else 1", response);
        }
      });
    });
  };

  // const convertResponse = (res: any) => {
  //     const obj = {
  //         data: {
  //             profile: res?.data.settings.profile,
  //             notification: res?.data.settings.notification,
  //             preference: res?.data.settings.preference,
  //             activity: res?.data.settings.activity,
  //             check_in: res?.data.settings.check_in,
  //             level: res?.data.settings.level,
  //             phase: res?.data.settings.phase,
  //             streak_days: res?.data.settings.streak_days,
  //         },
  //     };
  //     dispatch(LoginUser(obj));
  // };

  useEffect(() => {
    const obj = {
      method: "get_user_settings",
      user_id: user.data.user_id,
    };

    fetch(`${import.meta.env.VITE_PUBLIC_URL}profile`, {
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
          // console.log("getSettings", response);

          if (response.data.profile === "1") {
            //public
            setChecked(false);
          } else if (response.data.profile === "0") {
            //private
            setChecked(true);
          }

          if (response.data.notification === "1") {
            //ON
            setCheckedNot(true);
          } else if (response.data.notification === "0") {
            //OFF
            setCheckedNot(false);
          }
        } else {
          // console.log("else 1", response);
        }
      });
    });
  }, []);

  return (
    <div className="edup-content setting-content ">
      <div style={{ padding: "20px" }}></div>
      <div className="setting-head c0 my-2.5">
        <span className="setting-r1">Account Privacy</span>
      </div>
      <div className="setting-head my-2.5">
        <span className="c0">
          <input
            type="checkbox"
            className="gen-cb"
            defaultChecked={checked}
            checked={checked}
            onChange={handleChangeCheck}
          />
          <label className="c0">Private Account</label>
        </span>
      </div>
      <div className="setting-head  my-2.5">
        <span style={{ color: "#857e7e", fontSize: "1rem" }}>
          When your account is private, only people you approve can see your
          photos and videos on Instagram. Your existing followers won't be
          affected.
        </span>
      </div>
      {/* <div className='ac-setting-line' style={{ border: '0.2px solid #c5bfbf58', width: '700px', marginLeft: '50px', marginBottom: '20px', marginTop: '20px' }} ></div> */}
      <div className="setting-head c0 my-2.5">
        <span className="setting-r1">Notification</span>
      </div>
      <div className="setting-head my-2.5">
        <span className="c0">
          <input
            type="checkbox"
            className="gen-cb"
            defaultChecked={checkedNot}
            checked={checkedNot}
            onChange={handleChangeCheckNot}
          />
          <label className="c0">Notification ON </label>
        </span>
      </div>
      <div className="setting-head c0 my-2.5">
        <span className="setting-r1">Auto Enable Sound</span>
      </div>
      <div className="setting-head my-2.5">
        <span className="c0">
          <input
            type="checkbox"
            className="gen-cb"
            defaultChecked={checkedSound}
            checked={checkedSound}
            onChange={handleChangeCheckSound}
          />
          <label className="c0">Sound ON </label>
        </span>
      </div>
      <div className="mt-2 mx-auto ">
        <BTN className="px-32" onP={setSettings} title="Change Settings" />
      </div>
    </div>
  );
};

export default Settings;
