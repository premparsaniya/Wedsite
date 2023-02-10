import React, { useState } from 'react'
import { BTN, DownBox } from '../components'
import { useNavigate } from 'react-router-dom';
import { BLACK_LOGO } from '../assets';
import MyLoading from '../components/MyLoading';
import { toast } from 'react-toastify';

const ForgotPassword = () => {

    const [email, setEmail] = useState<string>("")
    const [error, setError] = useState<string>("");
    const [myLoading, setMyLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const forgot = () => {
        setError("");
        const loginUserObj = {
            method: "forgot_password",
            email: email,
        };
        setMyLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}login`,
            {
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
                        toast.success("OTP is sent to your email address.", { position: "top-center", autoClose: 1000 });
                        navigate("/VerifyOTP", {
                            state: {
                                email: `${email}`,
                                userId: `${response.data.user_id}`,
                            },
                        })
                        // console.log("response", response)
                    } else {
                        setError(response.message);
                    }
                    setMyLoading(false);
                });
            })
            .catch(() => {
                setError("Check your Network...");
            });
    }
    return (
        <section className="login-main-sec">
            <div className="root-container">
                <div className="box-fp">
                    <div className="f-insta-logo">
                        <img src={BLACK_LOGO} className="logo-f" alt="hh"></img>
                    </div>
                    <div className="fp-heading-div " >
                        <span className="f-text-heading">Forgot password</span>
                        <span className="f-text">Please enter your email address, You will receive to create new OTP via email.</span>
                    </div>
                    <div className="fp-input-div">
                        <input type="text"
                            placeholder='Enter email'
                            className="u-inp"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value), setError("") }}
                        />
                        <BTN
                            className="px-30"
                            onP={forgot}
                            loading={myLoading}
                            title="Send OTP"
                            disabled={
                                myLoading || (email !== "")
                                    ? false
                                    : true
                            }
                        />
                    </div>
                </div>
                <div className="f-back">
                    <DownBox className={"fp-under-box"} page={'/login'} linkName={'Back To Login'} text={undefined} />
                </div>
                {error ? (
                    <div className="fp-error-box">
                        <h1>{error}</h1>
                    </div>
                ) : null}
            </div>
        </section>
    )
}

export default ForgotPassword