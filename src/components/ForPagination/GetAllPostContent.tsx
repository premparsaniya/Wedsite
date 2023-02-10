import { forwardRef } from "react";

type Props = {
    val: any;
    index: number;
    showPostDetailsClick: (a: any) => void
};
const GetAllPostContent = forwardRef(({ val, index, showPostDetailsClick }: Props, ref: any) => {
    const postCardBody = (
        <div key={index} onClick={() => showPostDetailsClick(val)} >
            <article className="post bg-gray-100 text-white relative pb-full shadow-md  md:mb-6">
                <img
                    src={val.att_thumb}
                    alt="IMG"
                    className="w-full h-full object-cover aspect-square relative"
                />
            </article>
        </div>
    );
    const content = ref ? (
        <div className="w-1/3 p-px md:px-3" ref={ref}>{postCardBody}</div>
    ) : (
        <div className="w-1/3 p-px md:px-3">{postCardBody}</div>
    );
    return content;
});

export default GetAllPostContent