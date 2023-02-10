import { FC, ReactNode, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { App_state } from "~/reduxState";
import PopUp from "./PopUp";
import ReportPostBox from "./ReportPostBox";

interface Props {
  visible: boolean;
  onClose: (b: boolean) => void;
  closeBtnTxt?: string;
  className?: string;
  subClass?: string;
  value: any;
}

const SharePopup: FC<Props> = ({
  visible,
  onClose,
  closeBtnTxt,
  className = "",
  subClass = "",
  value,
}) => {

  const { user } = useSelector((state: App_state) => state.UserLogin);

  const token = user?.token;
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [report, setReport] = useState<boolean>(false);
  const [blockUser, setBlockUser] = useState<boolean>(false)

  const handleReportPost = () => {
    setReport(!report)
  }
  const handleBlockUserPopup = () => {
    setBlockUser(!blockUser)
  }

  const handleBlockUser = () => {
    const obj = {
      method: "block_user",
      blocked_user: value?.user_id,
    };
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}user`, {
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
          setLoading(false)
          setBlockUser(!blockUser)
          onClose(false)
          navigate("/")
          toast.success("user blocked successfully...", { position: "top-center", autoClose: 1000 });
        } else {
          // console.log("else", response);
        }
      });
    });
  }

  return visible ? (
    <>
      <div
        className={
          className +
          "fixed text-black flex items-center justify-center overflow-auto z-40 bg-black bg-opacity-40 left-0 right-0 top-0 bottom-0 transition-all duration-300"
        }
      >
        <div
          className={
            subClass +
            " bg-white rounded-xl shadow-2xl p-6  sm:w-8/12 xs:w-8/12 mx-10 flex justify-center flex-col"
          }
        >
          <div className="p-3 mb-3 ">
            <div className="text-center font-bold text-md cursor-pointer">
              share profile
            </div>
            <div className="flex  items-center justify-center">
              <div className="border border-gray-400 border-xs my-3 w-full" />
            </div>
            <div className="text-center font-bold text-md cursor-pointer" onClick={handleBlockUserPopup}>
              Block user
            </div>
            {/* <div className="flex  items-center justify-center">
              <div className="border border-gray-400 border-xs my-3 w-full" />
            </div>
            <div className="text-center font-bold text-md cursor-pointer" onClick={handleReportPost}>
              Report user
            </div> */}
          </div>
          <div className="flex  items-center justify-center">
            <button
              onClick={() => onClose(false)}
              className="secondary-btn hover:text-white hover:bg-black w-[60%] px-5"
            >
              {closeBtnTxt || "Close"}
            </button>
          </div>
        </div>
      </div>
      {
        report && <ReportPostBox postPopup={undefined} setPostPopup={onClose} value={value} setReport={setReport} report={report} />
      }
      {
        blockUser && < PopUp message="Are you sure want to block this user ?" btnMsg={"Block"} functionHandle={handleBlockUser} closePopup={handleBlockUserPopup} loading={loading} />
      }
    </>) : null;
};

export default SharePopup;
