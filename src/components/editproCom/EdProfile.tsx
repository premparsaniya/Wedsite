import React, { useState, useRef, useContext } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import { DEF_USER } from "~/assets";
import { LoginUser, LogoutUser, LogoutUserPost } from "~/reduxState";
import BTN from "../BTN";
import { toast } from "react-toastify";
import { AppContext, resetUser } from "~/context";

const EdProfile = () => {
  const refinp = useRef<HTMLInputElement | null>(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.UserLogin);
  const { dispatch: disp } = useContext(AppContext);
  const [name, setName] = useState<string>(user.data.name);
  const [email] = useState<string>(user.data.email);
  const [bio, setBio] = useState<string>(user.data.bio);
  const [gender, setGender] = useState<string>(user.data.gender);
  const [phonenum, setPhoneNum] = useState<string>(user.data.mobile);
  const [checked, setChecked] = useState<boolean>(false);
  const [photo, setPhoto] = useState<string>("");
  const [imgPreviewUrl, setImgPreviewUrl] = useState<string | ArrayBuffer | null>("");
  const [date, setDate] = useState<any>(new Date(user.data.dob));
  const [message, setMessage] = useState<string>("");
  const [myLoading, setMyLoading] = useState<boolean>(false);
  const token = user?.token;

  const handleChange = (event: any) => {
    setGender(event.target.value);
  };
  const handleChangeCheck = () => {
    setChecked(!checked);
  };

  const handleImageChangeimg = (e: any) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setPhoto(file);
      setImgPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const editpro = () => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    const formetedDate = [year, month, day].join("-");
    // console.log("ffff", formetedDate);
    const formDataNew = new FormData();
    formDataNew.append("method", "set_profile");
    formDataNew.append("name", name);
    formDataNew.append("email", email);
    formDataNew.append("gender", gender);
    formDataNew.append("mobile", phonenum);
    formDataNew.append("bio", bio);
    formDataNew.append("photo", photo);
    formDataNew.append("dob", formetedDate);
    formDataNew.append("user_id", id as string);

    setMyLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}profile`, {
      method: "POST",
      headers: {
        //   'Content-Type': 'application/json',
        //   'Accept': 'application/json',
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: formDataNew,
    })
      .then((result) => {
        result.json().then((response) => {
          if (response.status === 1) {
            // console.log("EDITed IF- ", response);
            updateRedux(response);
            setMyLoading(false);
          }
          if (response.status === 2) {
            toast.error("Your session is expired. Please login to access your account", {
              position: "top-center",
            });
            dispatch(LogoutUser());
            dispatch(LogoutUserPost());
            navigate("/");
            setMyLoading(false);
            resetUser(disp);
          }
          else {
            setMessage(response.message);
          }
        });
      })
      .catch((e) => {
        // console.log("error", e);
        setMessage(e.message);
        setMyLoading(false);
      });
  };

  const updateRedux = (res: any) => {
    const obj1 = {
      ...user,
      data: {
        ...user.data,
        name: res?.data.name,
        email: res?.data.email,
        bio: res?.data.bio,
        dob: res?.data.dob,
        gender: res?.data.gender,
        mobile: res?.data.mobile,
        photo: res?.data.photo,
      },
    };
    dispatch(LoginUser(obj1));
    navigate(`/userprofile/${id}`);
  };

  return (
    <div className="edup-content">
      <div style={{ padding: "20px" }} className="padding-span"></div>
      <div className="gen-pro-ed my-2.5">
        <div className="gen-pro-row">
          {imgPreviewUrl ? (
            <img
              className="gen-icon-img"
              src={imgPreviewUrl as string}
              crossOrigin="anonymous"
              onError={(e: any) =>
                (e.target.onerror = null) || (e.target.src = DEF_USER)
              }
              alt="hh"
            />
          ) : (
            <img
              className="gen-icon-img"
              src={user.data.photo}
              crossOrigin="anonymous"
              onError={(e: any) =>
                (e.target.onerror = null) || (e.target.src = DEF_USER)
              }
              alt="hh"
            />
          )}
        </div>
        <div className="gen-pro-col ds-f">
          <span className="c0">{user.data.name}</span>
          <span className="c1">
            <button
              className="gen-inp-btn"
              onClick={() => {
                refinp.current?.click();
              }}
            >
              Select Profile Image
              <input
                style={{ display: "none" }}
                hidden
                type="file"
                ref={refinp}
                accept="image/*"
                onChange={handleImageChangeimg}
              />
            </button>
          </span>
        </div>
      </div>

      <div className="gen-pro-ed my-2.5">
        <div className="gen-pro-row">
          <span className="c0">User Name</span>
        </div>
        <div className="gen-pro-col ds-f">
          {/* <span> */}
          <input
            type="text"
            className="p-inp"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {/* </span> */}
        </div>
      </div>
      {/* 
      <div className="gen-pro-ed my-2.5">
        <div className="gen-pro-row gen-pro-row-span"></div>
        <div className="gen-pro-col ds-f">
          <span className="edup-span-notice" style={{ color: "#857e7e" }}>
            Help people discover your account by using the name you're known by:
            either your full name, nickname, or business name. You can only
            change your name twice within 14 days.
          </span>
        </div>
      </div> */}

      <div className="gen-pro-ed my-2.5">
        <div className="gen-pro-row">
          <span className="c0">Email</span>
        </div>
        <div className="gen-pro-col ds-f">
          <span>
            <input type="text" className="p-inp" value={email} disabled />
          </span>
        </div>
      </div>

      <div className="gen-pro-ed my-2.5">
        <div className="gen-pro-row">
          <span className="c0">Bio</span>
        </div>
        <div className="gen-pro-col ds-f">
          <span>
            <textarea
              className="p-inp"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </span>
        </div>
      </div>

      <div className="gen-pro-ed my-2.5">
        <div className="gen-pro-row">
          <span className="c0">Date of Birth</span>
        </div>
        <div className="gen-pro-col ds-f">
          <span>
            <DatePicker
              selected={date}
              className="p-inp"
              onChange={setDate}
              showMonthDropdown
              showYearDropdown
            />
          </span>
        </div>
      </div>

      <div className="gen-pro-ed my-2.5">
        <div className="gen-pro-row">
          <span className="c0">Phone Number</span>
        </div>
        <div className="gen-pro-col ds-f">
          <span>
            <input
              type="text"
              className="p-inp"
              value={phonenum}
              onChange={(e) => setPhoneNum(e.target.value)}
            />
          </span>
        </div>
      </div>

      <div className="gen-pro-ed  my-2.5">
        <div className="gen-pro-row ">
          <span className="c0">Gender</span>
        </div>
        <div className="gen-pro-col ds-f">
          <div className="c0">
            <div className="flex items-center mr-4">
              <input
                id="male-radio"
                type="radio"
                value="M"
                checked={gender === "M"}
                name="inline-radio-group"
                className="radio-comp"
                onChange={handleChange}
              />
              <label htmlFor="male-radio" className="text-lg radio-label">
                Male
              </label>
            </div>
            <div className="flex items-center mr-4">
              <input
                id="female-radio"
                value="F"
                type="radio"
                checked={gender === "F"}
                name="inline-radio-group"
                className="radio-comp"
                onChange={handleChange}
              />
              <label htmlFor="female-radio" className="text-lg radio-label">
                Female
              </label>
            </div>
            <div className="flex items-center mr-4">
              <input
                id="other-radio"
                type="radio"
                value="O"
                checked={gender === "O"}
                name="inline-radio-group"
                className="radio-comp"
                onChange={handleChange}
              />
              <label htmlFor="other-radio" className="text-lg radio-label">
                Other
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="gen-pro-ed my-2.5">
        <div className="gen-pro-row-sub">
          <span className="gen-conf-corr c0">
            <input
              type="checkbox"
              className="gen-cb"
              checked={checked}
              onChange={handleChangeCheck}
            />
            <label className="c0">Conform Your Details is Correct</label>
          </span>
        </div>
      </div>

      {checked ? (
        <div className="mx-auto mt-2 ">
          <BTN
            className="px-32"
            onP={editpro}
            loading={myLoading}
            title="Save"
            disabled={myLoading}
          />
        </div>
      ) : null}
      {message ? (
        <div className="gen-pro-ed my-2.5">
          <div className="gen-pro-row-sub">
            <span className="c0">
              <label className="c0">{message}</label>
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EdProfile;
