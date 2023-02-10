import React from "react";

type Props = {
  className: string
}

const MyLoading = ({ className }: Props) => {
  return (
    <>
      <div className={className}></div>
      {/* <img
        className={className}
        src="../../public/images/Loading.gif"
        alt="LLL"
      /> */}
      {/* <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div> */}
    </>
  );
};

export default MyLoading;
