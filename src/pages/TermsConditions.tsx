import { useEffect, useState } from "react";
import { Loading } from "~/components";

function TermsConditions() {
  const [privacy, setPrivacy] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    crPost();
  }, []);

  const crPost = () => {
    const obj = {
      method: "get_page_content",
      page_id: 3,
    };
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}cms`, {
      method: "POST",
      headers: {
        accept: "application/json",
        contentType: "application/json",
        version: "1.0.0",
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
      {loading ? (
        <div className="w-full h-[100%] flex justify-center items-center">
          <Loading size={100} />
        </div>
      ) : (
        <div
          className="text-center"
          dangerouslySetInnerHTML={{ __html: privacy?.content }}
        />
      )}
    </>
  );
}
export default TermsConditions;
