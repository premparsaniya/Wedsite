import { DEF_USER } from "~/assets";

type Props = {
  popups: any;
  popupval: any;
  setPopupLike: any;
  popupLike: any;
  src: string;
  setPopupExplore: any;
};

const UserIcon = ({
  popups,
  popupval,
  setPopupLike,
  popupLike,
  src,
  setPopupExplore,
}: Props) => {
  const toggle = () => {
    popups(!popupval);
    // setPopupLike(!popupLike);
    // setPopupLike(false);
    // setPopupExplore(false);
  };
  return (
    <div onClick={() => toggle()} style={{ cursor: "pointer" }}>
      <img
        src={src}
        crossOrigin="anonymous"
        style={{
          width: "30px",
          height: "30px",
          backgroundColor: "grey",
          backgroundRepeat: "no-repeat",
          borderRadius: "40px",
        }}
        onError={(e: any) =>
          (e.target.onerror = null) || (e.target.src = DEF_USER)
        }
        alt="hh"
      />
    </div>
  );
};

export default UserIcon;
