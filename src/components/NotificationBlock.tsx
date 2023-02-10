import { useState, useEffect } from "react";
import { UP_ARROW } from "~/assets";
import { UserIcon } from ".";
import { useSelector } from "react-redux";

const NotificationBlock = () => {
  const { user } = useSelector((state: any) => state.UserLogin);
  const [value, setValue] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const token = user?.token;
  useEffect(() => {
    const obj = {
      method: "get_notifications",
      user_id: user.data.user_id,
      page: 1,
      limit: 10,
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
    }).then((res) => {
      res.json().then((response) => {
        if (response.status === 1) {
          // console.log("SET  Notification 4", response.data);

          setValue(response.data);
        } else {
          // console.log("else 1", response);
        }
      });
    });
  }, [token]);

  const acceptRequest = (id: any) => {
    const obj = {
      method: "accept_follow_request",
      user_id: user.data.user_id,
      user_2: id,
    };
    // console.log(obj);
    fetch(`${import.meta.env.VITE_API_URL}profile`, {
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
          // console.log("Accept Request", response);
          setMessage(`Request Accept ${response.message}`);
        } else {
          // console.log("else 1", response);
          setMessage(response.message);
        }
      });
    });
  };
  const rejectRequest = (id: any) => {
    const obj = {
      method: "reject_follow_request",
      user_id: user.data.user_id,
      user_2: id,
    };

    // console.log(obj);
    fetch(`${import.meta.env.VITE_API_URL}profile`, {
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
          // console.log("reject_follow_request", response);
          setMessage(`Request Reject ${response.message}`);
        } else {
          setMessage(response.message);
          // console.log("else 1", response);
        }
      });
    });
  };

  const deleteNotification = () => {
    const obj = {
      method: "delete_all_notifications",
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
    }).then((res) => {
      res.json().then((response) => {
        if (response.status === 1) {
          setValue([""]);
        } else {
          // console.log("else 1", response);
        }
      });
    });
  };
  return (
    <div className="notification-box">
      <img src={UP_ARROW} className="notification-arrow" alt="hhh" />
      <div className="notification-box-in">
        {value.map((val) => {
          return (
            <div className="notification-card">
              <div className="notification-row1">
                <span className="notification-row1-1">
                  <UserIcon src={val.sender.photo} popups={undefined} popupval={undefined} setPopupLike={undefined} popupLike={undefined} setPopupExplore={undefined} />
                </span>
                <span className="notification-row1-2">{val.sender.name}</span>
                {val.notification === "requested to follow you." ? (
                  <>
                    {message ? (
                      <></>
                    ) : (
                      <>
                        <span className="notification-row1-3">
                          <button
                            className="notification-btn"
                            onClick={() => acceptRequest(val.sender.user_id)}
                          >
                            Accept
                          </button>
                        </span>
                        <span className="notification-row1-3">
                          <button
                            className="notification-btn"
                            onClick={() => rejectRequest(val.sender.user_id)}
                          >
                            Reject
                          </button>
                        </span>
                      </>
                    )}
                  </>
                ) : null}
              </div>
              <div className="notification-row2">
                {message ? (
                  <span>{message}</span>
                ) : (
                  <span>{val.notification}</span>
                )}
              </div>
            </div>
          );
        })}
        {/* {
                    message ?
                    <>
                    <div className="notification-message">
                        <h1>message</h1>
                    </div>
                    </>: null
                } */}

        <div className="notification-card">
          <div className="notification-row11">
            <button
              onClick={() => deleteNotification()}
              style={{ borderRadius: "20px", border: "0px" }}
            >
              Delete All Notifications 🔔{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBlock;
