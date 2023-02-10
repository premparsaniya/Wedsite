import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import MyLoading from './MyLoading';
import { BTN } from "~/components"

type Props = {
    setReport: any,
    report: any;
    value: any,
    postPopup: any,
    setPostPopup: any,
}

const ReportPostBox = ({ setReport, report, value, postPopup, setPostPopup }: Props) => {

    const { user } = useSelector((state: any) => state.UserLogin);
    const token = user?.token;

    const [/* message */, setMessage] = useState<string>("");
    const [writeReport, setWriteReport] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false)


    const closeReport = () => {
        setReport(!report)
    }

    const handleReportClick = () => {
        if (writeReport !== "") {
            setLoading(true)
            const obj = {
                method: "report_post",
                post_id: value.post_id,
                user_id: user.data.user_id,
                report: writeReport,
            };
            fetch(`${import.meta.env.VITE_API_URL}post`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    contentType: "application/json",
                    version: "1.0.0",
                    token: `Bearer ${token}`,
                },
                body: JSON.stringify(obj),
            })
                .then((res) => {
                    res.json().then((response) => {
                        if (response.status === 1) {
                            toast.success("report send successfully...", { position: 'top-center' })
                            setReport(!report);
                            setPostPopup(!postPopup)
                            setLoading(false);

                            // console.log("resp report ---->", response)
                        } else {
                            setMessage(response.message);
                        }
                    });
                })
                .catch((e) => {
                    setMessage(e);
                });
        }
    }

    return (
        <div className='rpb-main-div'>
            <div className="rpb-contain-div">
                <div className="rpb-write-div">
                    <textarea value={writeReport} placeholder='Why are you reporting this post ?' className='rpb-text-area' name="text" id="" cols={50} rows={30} onChange={(e) => { setWriteReport(e.target.value) }} ></textarea>
                </div>
                <div className="rpb-btn-div">
                    {/* <button className="rpb-btn" onClick={closeReport} >Cancel</button> */}
                    <BTN title="Cancel" className='' onP={closeReport} />
                    <BTN loading={loading} title="Report" className='' onP={handleReportClick} />
                </div>
            </div>
        </div>
    )
}

export default ReportPostBox