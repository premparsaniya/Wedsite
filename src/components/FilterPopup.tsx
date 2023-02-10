import { Fragment } from "react";
import { useState } from "react";
import { CHECK_ICON } from "~/assets";
import { Modal } from ".";

type Props = {
  closePopup: () => void;
  visible: boolean;
  setSelectedValue: (str: string) => void;
  apiFunction: () => void;
};
const FilterPopup = ({
  closePopup,
  visible,
  setSelectedValue,
  apiFunction,
}: Props) => {
  const filterTitle = [
    {
      id: 0,
      name: "Normal",
    },
    {
      id: 1,
      name: "Most Liked",
    },
    {
      id: 2,
      name: "Most Commented",
    },
    {
      id: 3,
      name: "Most Bookmarked",
    },
    {
      id: 4,
      name: "Most Viewed",
    },
    {
      id: 5,
      name: "Most Shared",
    },
    {
      id: 6,
      name: " Most Popular",
    },
  ];

  const [fSelected, setFSelected] = useState<boolean>(false);
  const [fId, setFID] = useState<number>();

  const selectFilterClick = (item: any, updateTo: boolean) => {
    setFSelected(updateTo);
    if (updateTo) {
      setFID(item?.id);
    }
    setSelectedValue(item?.name);
    closePopup();
    apiFunction();
  };
  return (
    <Modal
      visible={visible}
      onClose={closePopup}
      onSave={() => closePopup()}
      saveBtnTxt="Close"
      hideClose
      subClass="lg:w-3/12 md:w-7/12 XL:w-5/12 px-0 pt-0 "
    >
      <div className="filter-popup-contain">
        <div className="filter-popup-message-div">
          {filterTitle.map((item: any, index: number) => {
            return (
              <Fragment key={index}>
                <div
                  className="pl-[5%] filter-title select-none "
                  onClick={
                    item.id == fId
                      ? () => selectFilterClick(item, false)
                      : () => selectFilterClick(item, true)
                  }
                >
                  <div className="filter-popup-title-span">{item.name}</div>
                  <div>
                    {item.id == fId &&
                      < img
                        src={CHECK_ICON}
                        alt="checl"
                        onClick={() => selectFilterClick(item, true)}
                      />}
                    {/* {item.id == fId ? (
                      <MdCheckCircle
                        onClick={() => selectFilterClick(item, false)}
                      />
                    ) : (
                      <CgRadioCheck
                        onClick={() => selectFilterClick(item, true)}
                      />
                    )} */}
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default FilterPopup;

// {value.id == playId ? (
//     playAudio ? (
//       <BsPauseCircleFill
//         className="pause-audio"
//         onClick={() =>
//           handlePlayAudio(value, false)
//         }
//       />
//     ) : (
//       <BsFillPlayCircleFill
//         className="play-audio"
//         onClick={() => handlePlayAudio(value, true)}
//       />
//     )
//   ) : (
//     <BsFillPlayCircleFill
//       className="play-audio"
//       onClick={() => handlePlayAudio(value, true)}
//     />
//   )}
