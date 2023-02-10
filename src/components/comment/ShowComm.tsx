import moment from "moment";
import { UserIcon } from "../";
import { useSelector } from "react-redux";

type props = {
  item: any;
  pid: string | number | unknown;
  setComment: (v: string) => void;
  setEdCommId: (v: string) => void;
  setDlCom: (v: string) => void;
  dlCom: any;
};

const ShowComm = ({
  item,
  pid,
  setComment,
  setEdCommId,
  setDlCom,
  dlCom,
}: props) => {
  const { user } = useSelector((state: any) => state.UserLogin);
  const token = user?.token;

  const editComment = () => {
    setComment(item?.comment);
    setEdCommId(item?.comment_id);
  };
  const deleteComment = () => {
    const obj = {
      method: "delete_post_comment",
      post_id: pid,
      comment_id: item?.comment_id,
      user_id: user.data.user_id,
    };
    // console.log("obj---", obj);
    fetch(`${import.meta.env.VITE_API_URL}post`, {
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
          setDlCom(item?.comment_id);
        }
      });
    });
  };

  return (
    <div className="uap-show-comm" key={item?.comment_id}>
      <div className="uap-sh-card">
        <span className="uap-c-n ">
          <UserIcon
            src={item?.photo}
            popups={undefined}
            popupval={undefined}
            setPopupLike={undefined}
            popupLike={undefined}
            setPopupExplore={undefined}
          />
          {item?.name}{" "}
        </span>
        <div className="uap-s-c">
          <span
            style={{
              width: "90%",
              textAlign: "justify",
              flexWrap: "wrap",
              overflowWrap: "break-word",
            }}
          >
            {item?.comment}
          </span>

          {item?.user_id === user.data.user_id && (
            <>
              <span
                style={{
                  fontSize: "1.3rem",
                  paddingLeft: "10px",
                  cursor: "pointer",
                }}
              >
                {/* EDIT ICON =>  < onClick={() => editComment()} /> */}
              </span>
              <span style={{ fontSize: "1.3rem", cursor: "pointer" }}>
                {/*  DELETE ICON =>  <   onClick={() => deleteComment()} /> */}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="uap-sh-t">
        <span className="uap-time">
          {moment
            .utc(`${item?.reg_date}`)
            .local()
            .startOf("seconds")
            .fromNow()}
        </span>
      </div>
    </div>
  );
};

export default ShowComm;
