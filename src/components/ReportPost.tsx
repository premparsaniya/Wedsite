import React from "react";

type Props = {
  setReport: any;
  reportPost: any;
  message: any;
};

const ReportPost = ({ setReport, reportPost, message }: Props) => {
  const reportData = [`Report Post`, `Hide Post`, `Block User`, `Close`];

  const goBack = () => {
    setReport(false);
  };

  const doReport = (e: any) => {
    reportPost(e);
  };

  return (
    <>
      <div className="reportpost-main">
        <div className="reportpost-card">
          {/* <div className="reportpost-head ">
            <span style={{ width: "300px", textAlign: "center" }}>
              Report Post
            </span>
            <span
              style={{
                width: "40px",
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {" "}
              <GiCrossMark />{" "}
            </span>
          </div> */}

          {/* <div className="reportpost-head ">
                        <span style={{ width: '350px', fontSize: '1rem', textAlign: 'left', color: 'red' }}>Why are you reporting this post?</span>
                    </div> */}

          {reportData.map((element) => {
            return (
              <div className="reportpost-head1" onClick={() => goBack()}>
                <span
                  onClick={() => doReport(element)}
                  style={{
                    width: "350px",
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  {element}
                </span>
              </div>
            );
          })}
        </div>
        {message ? (
          <>
            <div className="reportpost-head ">
              <span
                style={{
                  width: "350px",
                  fontSize: "1rem",
                  textAlign: "left",
                  color: "red",
                }}
              >
                {message}
              </span>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default ReportPost;
