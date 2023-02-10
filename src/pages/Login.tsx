import React, { useState } from "react";
import { BTN, DownBox } from "../components/index";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../reduxState/action";
// import MyLoading from "../components/MyLoading";
import { BLACK_LOGO } from "../assets";

const Login = () => {
  // const { user } = useSelector((state: any) => state.UserLogin);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [un, setUN] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [terms, setTerms] = useState<boolean>(false);
  const [myLoading, setMyLoading] = useState<boolean>(false);

  const goHome = () => {
    setError("");
    if (un !== "" && pass !== "") {
      const loginUserObj = {
        username: un,
        password: pass,
        method: "do_login",
      };
      setMyLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          version: "1.0.0",
          // token: `Bearer ${token}`,
          // 'Access-Control-Allow-Origin' : "*",
        },
        body: JSON.stringify(loginUserObj),
      })
        .then((result) => {
          result.json().then((response) => {
            if (response.status === 1) {
              // setNavBAck("1");
              convertResponse(response);
              // console.log("Responce IF", response);
            } else {
              setError(response.message);
            }
            setMyLoading(false);
          });
        })
        .catch(() => {
          setMyLoading(false);
          setError("Check your Network...");
        });
    }
  };

  const convertResponse = (res: any) => {
    const obj = {
      data: {
        name: res?.data.name,
        email: res?.data.email,
        bio: res?.data.bio,
        dob: res?.data.dob,
        gender: res?.data.gender,
        mobile: res?.data.mobile,
        profile_status: res?.data.profile_status,
        token: res?.extra.token,
        photo: res?.data.photo,
        user_id: res?.data.user_id,
        user_type: res?.data.user_type,
        status: res?.data.status,
        is_password_set: res?.data.is_password_set,
        total_followers: res?.data.total_followers,
        total_followings: res?.data.total_followings,
        total_follow_requests: res?.data.total_follow_requests,
        noti_badge_count: res?.data.noti_badge_count,
        settings: {
          profile: res?.data.settings.profile,
          notification: res?.data.settings.notification,
          preference: res?.data.settings.preference,
          activity: res?.data.settings.activity,
          check_in: res?.data.settings.check_in,
          level: res?.data.settings.level,
          phase: res?.data.settings.phase,
          streak_days: res?.data.settings.streak_days,
        },
        activity_instructions: res?.data.activity_instructions,
        posts: [
          {
            // total_post: res?.data.posts.total_post,
            reference_post: [],
          },
        ],
      },
      token: res?.extra.token,
      session_id: res?.session_id,
      message: res?.message,
      status: res?.status,
    };
    dispatch(LoginUser(obj));
    navigate("/");
  };

  const forgot = () => {
    navigate("/reset");
  };

  return (
    <>
      <section className="login-main-sec">
        <div className="root-container">
          <div className="box-l">
            <div className="insta-logo ">
              <img src={BLACK_LOGO} className="login-logo" alt="hh"></img>
            </div>
            <div
              className="login-inp d-f"
              style={{ justifyContent: "space-between" }}
            >
              <input
                type="email"
                placeholder="Email "
                onChange={(e) => {
                  setUN(e.target.value), setError("");
                }}
                value={un}
                className="u-inp"
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  setPass(e.target.value), setError("");
                }}
                value={pass}
                className="p-inp my-2.5"
              />
              <div className="login-forgot-psw">
                <span style={{ fontSize: "15px" }}>
                  <input
                    type="checkbox"
                    checked={terms}
                    className="login-checkbox"
                    onChange={({ target }) => { setTerms(target.checked); setError(""); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { goHome() } }}
                  />{" "}
                  <Link className="ml-2" to="/Terms_and_Conditions">Terms and Conditions</Link>
                </span>
                <span
                  className="login-fp-span"
                  style={{ fontSize: "15px" }}
                  onClick={() => forgot()}
                >
                  Forgot Password?
                </span>
              </div>
              <BTN
                className="px-32"
                onP={goHome}
                loading={myLoading}
                title="Log In"
                disabled={
                  myLoading || (un !== "" && pass !== "" && terms)
                    ? false
                    : true
                }
              />
            </div>
          </div>
          <DownBox
            text={`Don't have an account?`}
            className={"l-under-box"}
            linkName={`Sign Up`}
            page={`/signup`}
          />
          {error ? (
            <div className="login-error-box">
              <h1>{error}</h1>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default Login;
