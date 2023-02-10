import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  val: any;
  index: any;
};
const Posts = ({ val, index }: Props) => {
  const [hover, setHover] = useState<boolean>(false);

  // const l1 = val.attachments.length

  // const imgSrc = val.attachments[l1 - 1]?.attachment
  const navigate = useNavigate();
  // const imgSrc= val.attachments[0]?.attachment || "../assest/image/.jpg"
  // console.log('post p1',val);

  const previewPost = (id: any) => {
    navigate(`/uapp/${id}`);
  };
  const showlike = (e: any) => {
    !hover && setHover(true);
  };
  const offlike = (e: any) => {
    hover && setHover(false);
  };
  return (
    <>
      <div
        className="posts-card"
        key={index}
        onMouseEnter={(e) => showlike(e)}
        onMouseLeave={(e) => offlike(e)}
      >
        {/* <img src={val.attachment} id="stID" title="IMAGE NOT FOUND" alt="img"
          // onError={(event : any) => event.currentTarget.src = { //-- Default local img --
          }} onClick={() => previewPost(val.post_id)} className="post-feed-img" /> */}
        <video width="100%" height="100%" className="post-feed-img">
          <source src={val.attachment} type="video/mp4" />
        </video>
        {hover ? (
          <>
            <div
              className="posts-card-hover"
              onClick={() => previewPost(val.post_id)}
            >
              <span style={{ color: "#fff", paddingRight: "5px" }}>
                {val.likes}
              </span>
              <span style={{ color: "#fff", paddingRight: "5px" }}>
                {/* Like Icon */}
              </span>
              <span style={{ color: "#fff", paddingRight: "5px" }}>
                {val.comments}
              </span>
              <span style={{ color: "#fff", paddingRight: "5px" }}>
                {/* Comments Icon */}
              </span>
            </div>
          </>
        ) : null}
        {/* <img src={val.attachments[0]} alt="...post"  className="post-feed-img"/> */}
      </div>
    </>
  );
};

export default Posts;

// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NTkzMzE5ODIsImlzcyI6ImxvY2FsaG9zdCIsImV4cCI6MTY5MDg2Nzk4MiwidXNlcl9pZCI6IjQzIn0.eq1Oq65oqFGnGy-WOS0Cyr6SUUmqQdY4n8uS58gEZMg
