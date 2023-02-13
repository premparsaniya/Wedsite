import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loading } from "~/components";

const PrivacyPolicy = () => {
  const [privacy, setPrivacy] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useSelector((state: any) => state.UserLogin);
  const token = user?.token;

  useEffect(() => {
    crPost();
  }, []);

  const crPost = () => {
    const obj = {
      method: "get_page_content",
      page_id: 3,
    };
    setLoading(true);
    fetch(`${import.meta.env.VITE_PUBLIC_URL}cms`, {
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
          setPrivacy(response.data);
          setLoading(false);
        } else {
          // console.log("else", response);
        }
      });
    });
  };

  return (
    <>
      <div className="edup-content">
        <div className="p-p-div">
          {loading ? (
            <div className="w-full h-[100%] flex justify-center items-center">
              <Loading size={100} />
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: privacy?.content }} />
          )}
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
