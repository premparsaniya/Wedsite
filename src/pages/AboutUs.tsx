import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loading } from "~/components";

const AboutUs = () => {
  const [aboutUs, setAboutUs] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useSelector((state: any) => state.UserLogin);
  const token = user?.token;

  useEffect(() => {
    aboutUsFunc();
  }, []);

  const aboutUsFunc = () => {
    const obj = {
      method: "get_page_content",
      page_id: 1,
    };
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}cms`, {
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
          setAboutUs(response.data);
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
        <div className="about-us-div">
          {loading ? (
            <div className="w-full h-[100%] flex justify-center items-center">
              <Loading size={100} />
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: aboutUs?.content }} />
          )}
        </div>
      </div>
    </>
  );
};

export default AboutUs;
