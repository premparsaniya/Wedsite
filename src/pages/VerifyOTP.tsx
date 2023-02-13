import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { BLACK_LOGO } from '../assets';
import { BTN, DownBox } from '../components';
import MyLoading from '../components/MyLoading';

const VerifyOTP = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [getOtp, setOtp] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [myLoading, setMyLoading] = useState<boolean>(false);

    const onConfirmClick = () => {
        setError("")
        const otpVerifyData = {
            method: "verify_otp",
            email: `${location.state.email}`,
            user_id: `${location.state.userId}`,
            otp: `${getOtp}`,
        };
        setMyLoading(true);

        fetch(`${import.meta.env.VITE_PUBLIC_URL}login`, {
            method: "POST",
            headers: {
                Accept: "application/Json",
                "Content-Type": "application/Json",
                version: "1.0.0",
            },
            body: JSON.stringify(otpVerifyData),
        })
            .then((result) => {
                result.json().then((res) => {
                    if (res.status === 1) {
                        navigate("/setPassword", {
                            state: {
                                email: `${location.state.email}`,
                                userId: `${location.state.userId}`,
                            },
                        });
                    } else {
                        setError(res.message);
                    }
                    setMyLoading(false);
                });
            })
            .catch(() => { });
    };

    return (
        <>
            <section className="login-main-sec">
                <div className="root-container">
                    <div className="box-vo">
                        <div className="vo-insta-logo">
                            <img src={BLACK_LOGO} className="logo-vo" alt="hh"></img>
                        </div>
                        <div className="vo-heading-div " >
                            <span className="vo-text-heading">Verification</span>
                            <span className="vo-text">Please enter the verification code :</span>
                        </div>
                        <div className="vo-input-div">
                            <input type="text"
                                placeholder='OTP'
                                className="u-inp"
                                value={getOtp}
                                onChange={(e) => { setOtp(e.target.value), setError("") }}
                            />

                            <BTN
                                className="px-30"
                                onP={onConfirmClick}
                                loading={myLoading}
                                title="Verify"
                                disabled={
                                    myLoading || (getOtp !== "")
                                        ? false
                                        : true
                                }
                            />
                        </div>
                    </div>
                    <div className="vo-back">
                        <DownBox className={"vo-under-box"} page={'/login'} linkName={'Back To Login'} text={undefined} />
                    </div>
                    {error ? (
                        <div className="vo-error-box">
                            <h1>{error}</h1>
                        </div>
                    ) : null}
                </div>
            </section>
        </>
    )
}

export default VerifyOTP