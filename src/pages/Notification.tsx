import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BTN, SpinningLoader } from "~/components";
import NotificationCards from "~/components/ForPagination/NotificationCards";
import { DELETE_ICON } from "../assets";
import { LogoutUser, LogoutUserPost } from "~/reduxState";
import { AppContext, resetUser } from "~/context";

function Notification() {
  const { user } = useSelector((state: any) => state.UserLogin);
  const { dispatch: disp } = useContext(AppContext);
  const [nValue, setNValue] = useState<any>([]);
  const [btnToggle, setBtnToggle] = useState<boolean>(false);
  const [rLoading, setRLoading] = useState<boolean>(false);
  const [aLoading, setALoading] = useState<boolean>(false);

  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const limit = 10;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = user?.token;

  useEffect(() => {
    getAllNotification();
  }, [pageNo]);

  // console.log("user", user);

  const getAllNotification = () => {
    setLoading(true);
    const obj = {
      method: "get_notifications",
      user_id: user.data.user_id,
      page: pageNo,
      limit: limit,
    };

    fetch(`${import.meta.env.VITE_PUBLIC_URL}profile`, {
      method: "POST",
      headers: {
        accept: "application/json",
        contentType: "application/json",
        version: "1.0.0",
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    }).then((res) => {
      res
        .json()
        .then((response) => {
          if (response.status === 1) {
            let pLimit = limit;
            let pData = response?.data?.length;
            setHasNextPage(pData >= pLimit);
            if (pageNo === 1) {
              setNValue(response.data);
            } else {
              let clone = [...nValue];
              response?.data && clone.push(...response?.data);
              setNValue(clone);
            }
          }
          if (response.status === 2) {
            toast.error("Your session is expired. Please login to access your account", {
              position: "top-center",
            });
            dispatch(LogoutUser());
            dispatch(LogoutUserPost());
            navigate("/");
            resetUser(disp);
          }
        })
        .finally(() => setLoading(false));
    });
  };

  const acceptRequest = (id: string) => {
    setALoading(true);
    const obj = {
      method: "accept_follow_request",
      user_id: user.data.user_id,
      user_2: id,
    };
    // console.log(obj);
    fetch(`${import.meta.env.VITE_PUBLIC_URL}profile`, {
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
          setBtnToggle(!btnToggle);
          setALoading(false);
          getAllNotification();
          toast.success(`${response.message}`, {
            position: "top-center",
            autoClose: 300,
          });
        } else {
          // console.log("else 1", response);
        }
      });
    });
  };
  const rejectRequest = (id: string) => {
    setRLoading(true);
    const obj = {
      method: "reject_follow_request",
      user_id: user.data.user_id,
      user_2: id,
    };

    // console.log(obj);
    fetch(`${import.meta.env.VITE_PUBLIC_URL}profile`, {
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
          setBtnToggle(!btnToggle);
          setRLoading(false);
          getAllNotification();
          toast.success(`${response.message}`, {
            position: "top-center",
            autoClose: 300,
          });
        } else {
          // console.log("else 1", response);
        }
      });
    });
  };

  const deleteNotification = () => {
    setLoading(true);
    const obj = {
      method: "delete_all_notifications",
      user_id: user.data.user_id,
    };

    fetch(`${import.meta.env.VITE_PUBLIC_URL}profile`, {
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
          setNValue([]);
          setLoading(false);
        } else {
          setLoading(false);
          // console.log("else 1", response);
        }
      });
    });
  };

  const goProfile = (id: number) => {
    navigate(`/userprofile/${id}`);
  };

  const intObserver = useRef<any>();
  const lastPostRef = useCallback(
    (post: any) => {
      if (loading) return;
      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {        
        if (posts[0].isIntersecting && hasNextPage) {
          setPageNo((prev) => prev + 1);
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [loading, hasNextPage]
  );

  return (
    <section className="discover-p_m">
      <div className="discover-box">
        <div className="relative justify-center discover-header">
          Notification
          <img
            src={DELETE_ICON}
            alt="dlt"
            onClick={() => deleteNotification()}
            className="absolute ml-[90%] cursor-pointer"
          />
          {/* <BTN className="px-32"
                onP={deleteNotification}
                loading={myLoading}
                title="Log In"
                disabled={
                  myLoading || (un !== "" && pass !== "" && terms)
                    ? false
                    : true
                } /> */}
        </div>
        <div className="discover-border" style={{ marginBottom: "10px" }}></div>
        <div className="" style={{ maxHeight: "700px", overflow: "scroll" }}>
          {nValue?.length > 0
            ? nValue.map((item: any, index: number) => {
              return nValue?.length === index + 1 ? (
                <NotificationCards
                  key={index}
                  item={item}
                  index={index}
                  goProfile={goProfile}
                  aLoading={aLoading}
                  rLoading={rLoading}
                  acceptRequest={acceptRequest}
                  rejectRequest={rejectRequest}
                  ref={lastPostRef}
                />
              ) : (
                <NotificationCards
                  key={index}
                  item={item}
                  index={index}
                  goProfile={goProfile}
                  aLoading={aLoading}
                  rLoading={rLoading}
                  acceptRequest={acceptRequest}
                  rejectRequest={rejectRequest}
                />
              );
            })
            : !loading && <p className="text-center pt-[40%] " >No notifications yet !!</p>}
          {loading && (
            <SpinningLoader
              isLoading
              colClass="text-black "
              size={10}
              className="flex items-center justify-center w-full mb-4"
            />
          )}
        </div>
      </div>
    </section>
  );
}
export default Notification;