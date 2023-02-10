import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UP_ARROW } from "~/assets";
import { UserIcon } from ".";

type props = {
  setPopupExplore: any
}
const Explore = ({ setPopupExplore }: props) => {
  const { user } = useSelector((state: any) => state.UserLogin);
  const [value, setValue] = useState([]);
  const [message, setMessage] = useState("");
  const [request, setRequest] = useState(false);

  const token = user?.token;

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
          // console.log('Accept Request', response);
          setMessage(`Accept ${response.message}`);
        } else {
          // console.log('else 1', response);
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
          // console.log('reject_follow_request', response);
          setMessage(` Reject ${response.message}`);
        } else {
          setMessage(response.message);
          // console.log('else 1', response);
        }
      });
    });
  };
  useEffect(() => {
    const obj = {
      method: "get_following_requests",
      user_id: user.data.user_id,
      page: 3,
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
          // console.log('get ', response);
          setValue(response.data);
          if (response.data.length === 0) {
            // console.log('asdasd');
            setRequest(true);
          }
          // setUser1Status(response.extra.user_1_follow_request);
          // setUser2Status(response.extra.user_2_follow_request);
        } else {
          // console.log("else 1", response);
        }
      });
    });
  }, [token]);
  return (
    <>
      <div className="explore-box">
        <img src={UP_ARROW} className="explore-arrow" alt="hello" />
        <div className="explore-box-in">
          {!request ? (
            <>
              {value.map((val: any) => {
                return (
                  <div className="explore-card">
                    <div className="explore-row1">
                      <span className="explore-row1-1">
                        <UserIcon src={val.photo} popups={undefined} popupval={undefined} setPopupLike={undefined} popupLike={undefined} setPopupExplore={undefined} />
                      </span>
                      <span className="explore-row1-2">{val.name}</span>

                      <span className="explore-row1-3">
                        <button
                          className="explore-btn"
                          onClick={() => acceptRequest(val.user_id)}
                        >
                          Accept
                        </button>
                      </span>
                      <span className="explore-row1-3">
                        <button
                          className="explore-btn"
                          onClick={() => rejectRequest(val.user_id)}
                        >
                          Reject
                        </button>
                      </span>
                    </div>
                    <div className="explore-row2">
                      {message ? (
                        <span>Request {message} </span>
                      ) : (
                        <span>Request</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="explore-card">
              <div className="explore-row1">
                <div className="explore-row2">
                  {<span>No Following Request Yet...</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Explore;
