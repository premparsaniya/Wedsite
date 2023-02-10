import { forwardRef, Fragment } from "react";

type Props = {
    item: any;
    index: number;
    showPostDetailsClick: (a: any) => void
};

const UserProfilePostCards = forwardRef(({ item, index, showPostDetailsClick }: Props, ref: any) => {
    const postCardBody = (
        <Fragment
            key={index}
        >
            {/* <a href=""> */}
            <article className="post bg-gray-100 text-white relative pb-full  md:mb-6 shadow-md">
                <img
                    src={item?.att_thumb}
                    alt="IMG"
                    className="w-full h-full object-cover aspect-square relative"
                    crossOrigin="anonymous"
                />
            </article>
            {/* </a> */}
        </Fragment>
    );
    const content = ref ? (
        <div className="w-1/3 p-px md:px-3" onClick={() => showPostDetailsClick(item)} ref={ref}>{postCardBody}</div>
    ) : (
        <div className="w-1/3 p-px md:px-3" onClick={() => showPostDetailsClick(item)}>{postCardBody}</div>
    );
    return content;
});

export default UserProfilePostCards