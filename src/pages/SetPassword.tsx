import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BTN } from '~/components';
import { BLACK_LOGO } from '../assets'
import MyLoading from '../components/MyLoading'

const SetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [pass, setPass] = useState<string>("");
    const [confPass, setConfPass] = useState<string>("")
    const [error, setError] = useState<string>("");
    const [myLoading, setMyLoading] = useState<boolean>(false);

    const updatePass = () => {

        setError("")
        if (pass === confPass) {
            const setPassData = {
                method: "set_new_password",
                email: `${location.state.email}`,
                user_id: `${location.state.userId}`,
                password: confPass,
            };

            setMyLoading(true);

            fetch(`${import.meta.env.VITE_API_URL}login`, {
                method: "POST",
                headers: {
                    Accept: "application/Json",
                    "Content-Type": "application/Json",
                    version: "1.0.0",
                },
                body: JSON.stringify(setPassData),
            })
                .then((result) => {
                    result.json().then((res) => {
                        if (res.status === 1) {
                            navigate("/login");
                        } else {
                            setError(res.message);
                        }
                        setMyLoading(false);
                    });
                })
                .catch(() => { });
        }
        else {
            toast.error("Password doesn't match", { position: "top-center", autoClose: 1000 });
        }
    }
    return (
        <>
            <section className="login-main-sec" >
                <div className="root-container">
                    <div className="box-cp">
                        <div className="cp-insta-logo ">
                            <img src={BLACK_LOGO} className="cp-logo" alt="hh"></img>
                        </div>
                        <div className="cp-heading-div" >
                            <span className="cp-text-heading">Generate password</span>
                            <span className="cp-text">Create a new password and please never share anyone for safe use.</span>
                        </div>
                        <div className="cp-inp" >
                            <input
                                type="password"
                                placeholder="Enter new password"
                                onChange={(e) => { setPass(e.target.value), setError("") }}
                                value={pass}
                                className="u-inp"
                            />
                            <input
                                type="password"
                                placeholder="Enter confirm new password"
                                onChange={(e) => { setConfPass(e.target.value), setError("") }}
                                value={confPass}
                                className="p-inp"
                            />
                            <BTN
                                className="px-30"
                                onP={updatePass}
                                loading={myLoading}
                                title="Update password"
                                disabled={
                                    myLoading || (confPass !== "" && pass !== "")
                                        ? false
                                        : true
                                }
                            />
                        </div>
                    </div>
                    {error ? (
                        <div className="cp-error-box">
                            <h1>{error}</h1>
                        </div>
                    ) : null}
                </div>
            </section>
        </>
    )
}

export default SetPassword