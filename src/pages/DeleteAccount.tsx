import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { App_state, LogoutUser, LogoutUserPost } from "~/reduxState";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PopUp from "../components/PopUp";
import { BTN } from "~/components";
import { AppContext, resetUser } from "~/context";

const DeleteAccount = () => {
  const { user } = useSelector((s: App_state) => s.UserLogin);
  const token = user?.token;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dispatch: disp } = useContext(AppContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);

  const openDeletePopup = () => setPopup(!popup);
  const CloseDeletePopup = () => setPopup(!popup);

  const handleDeleteAccountBtn = () => {
    const obj = {
      method: "delete_user",
      user_id: user?.data?.user_id,
    };
    setLoading(true);
    fetch(`${import.meta.env.VITE_PUBLIC_URL}user`, {
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
          setLoading(false);
          setPopup(!popup);
          toast.success("account deleted successfully...", {
            position: "top-center",
            autoClose: 1000,
          });
          dispatch(LogoutUser());
          dispatch(LogoutUserPost());
          navigate("/");
          resetUser(disp);
        } else {
          // console.log("else", response);
        }
      });
    });
  };
  return (
    <>
      <div className="edup-content">
        {popup && (
          <PopUp
            message="Are you sure want to Delete your account ?"
            btnMsg="Delete"
            functionHandle={handleDeleteAccountBtn}
            closePopup={CloseDeletePopup}
            loading={loading}
          />
        )}
        <div className="delete-ac-content">
          <div className="text-center delete-ac-content-inner">
            <span style={{ color: "#857e7e", fontSize: "1.5rem" }}>
              "you want to delete account? once you delete the account you can
              not access your account again"
            </span>
          </div>
          <div className="mx-auto mt-8 ">
            <BTN
              className="px-32"
              onP={openDeletePopup}
              title=" Delete Account"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteAccount;
