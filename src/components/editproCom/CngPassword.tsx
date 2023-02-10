import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DEF_USER } from "~/assets";
import { useParams, useNavigate } from "react-router-dom";
import BTN from "../BTN";

const CngPassword = () => {
  const { user } = useSelector((state: any) => state.UserLogin);
  const [pass, setPass] = useState<string>("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState<string>("");
  const [currentPass, setCurrentPass] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");
  const [checked, setChecked] = useState<boolean>(false);

  const token = user?.token;

  const handleChangeCheck = () => {
    if (currentPass === confirmPass) {
      setChecked(!checked);
      setMessage("");
    } else {
      setChecked(!checked);
      setMessage("Current password and confirm password does not Match...");
    }
  };

  const changePassword = () => {
    if (currentPass === confirmPass) {
      const obj = {
        method: "change_password",
        email: user.data.email,
        old_password: pass,
        new_password: confirmPass,
        user_id: user.data.user_id,
      };
      fetch(`${import.meta.env.VITE_API_URL}profile`, {
        method: "POST",
        headers: {
          accept: "application/json",
          contentType: "application/json",
          version: "1.0.0",
          token: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      })
        .then((result) => {
          result.json().then((response) => {
            if (response.status === 1) {
              // console.log(response);
              navigate(`/uapp/ep/${id}/${"gen"}`);
            }
            // console.log('34',response);
            setMessage(response.extra.message);
          });
        })
        .catch((err) => {
          setMessage(err);
        });
    } else {
      setMessage("Current password and confirm password does not Match...");
    }
  };

  return (
    <div className="edup-content">
      <div style={{ padding: "20px" }}></div>

      <div className="gen-pro-ed my-2.5">
        <div className="gen-pro-row">
          <img
            className="cng-icon-img"
            src={user.data.photo}
            onError={(e: any) =>
              (e.target.onerror = null) || (e.target.src = DEF_USER)
            }
            alt="hh"
            crossOrigin="anonymous"
          />
        </div>
        <div className="gen-pro-col ds-f">
          <span className="c0">{user.data.name}</span>
        </div>
      </div>
      <div className="gen-pro-ed my-2.5">
        <div className="gen-pro-row">
          <span className="c0">Email</span>
        </div>
        <div className="gen-pro-col ds-f">
          <span>
            <input
              type="email"
              className="p-inp"
              value={user.data.email}
              disabled
            />
          </span>
        </div>
      </div>

      <div className="gen-pro-ed my-2.5">
        <div className="gen-pro-row">
          <span className="c0">Old Pasword</span>
        </div>
        <div className="gen-pro-col ds-f">
          <span>
            <input
              type="password"
              className="p-inp"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </span>
        </div>
      </div>

      <div className="gen-pro-ed my-2.5">
        <div className="gen-pro-row">
          <span className="c0">New Pasword</span>
        </div>
        <div className="gen-pro-col ds-f">
          <span>
            <input
              type="password"
              className="p-inp"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
            />
          </span>
        </div>
      </div>

      <div className="gen-pro-ed my-2.5">
        <div className="cng-pro-row">
          <span className="c0">Confirm New Pasword</span>
        </div>
        <div className="gen-pro-col ds-f">
          <span>
            <input
              type="password"
              className="p-inp"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </span>
        </div>
      </div>

      <div className="gen-pro-ed my-2.5">
        <div className="gen-pro-row-sub">
          <span className="c0">
            <input
              type="checkbox"
              className="cng-cb"
              checked={checked}
              onChange={handleChangeCheck}
            />
            <label className="c0">Conform Your Details is Correct</label>
          </span>
        </div>
      </div>
      {message ? (
        <div className="gen-pro-ed my-2.5">
          <div className="gen-pro-row-sub">
            <span className="c0">
              <label className="c0">{message}</label>
            </span>
          </div>
        </div>
      ) : (
        <>
          {checked ? (
            <div className="mx-auto mt-2 ">
              <BTN className="px-32" onP={changePassword} title="Edit" />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default CngPassword;
