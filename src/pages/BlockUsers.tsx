import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loading, UserIcon } from "../components";

const BlockUsers = () => {
  const [blockUser, setBlockUser] = useState<any>([]);

  const { user } = useSelector((state: any) => state.UserLogin);
  const token = user?.token;

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getBlockUserList();
  }, []);

  const getBlockUserList = () => {
    const obj = {
      method: "block_user_list",
    };
    setLoading(true);
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
          setBlockUser(response.data);
          setLoading(false);
          // console.log(".../....", response)
        } else {
          // console.log("else", response);
        }
      });
    });
  };

  const unBlockUserClick = (blockUserId: number) => {
    const obj = {
      method: "unblock_user",
      blocked_user: blockUserId,
    };
    setLoading(true);
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
          setBlockUser(response.data);
          setLoading(false);
          getBlockUserList();
          // console.log("un block", response)
        } else {
          // console.log("else", response);
        }
      });
    });
  };

  return (
    <>
      <div className="edup-content">
        <div className="block-list-div">
          {loading ? (
            <div className="w-full h-[100%] flex justify-center items-center">
              {" "}
              <Loading size={100} />
            </div>
          ) : (
            blockUser.map((item: any, index: number) => {
              return (
                <Fragment key={index}>
                  <div className="block-u-div">
                    <div className="block-user-dp-name-div ">
                      <UserIcon
                        src={item.photo}
                        popups={undefined}
                        popupval={undefined}
                        setPopupLike={undefined}
                        popupLike={undefined}
                        setPopupExplore={undefined}
                      />
                      <span className="block-user-name">{item.name}</span>
                    </div>
                    <div className="block-btn-div">
                      <button
                        className="block-btn"
                        onClick={() => unBlockUserClick(item.blocked_user_id)}
                      >
                        Unblock
                      </button>
                    </div>
                  </div>
                </Fragment>
              );
            })
          )}
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default BlockUsers;
