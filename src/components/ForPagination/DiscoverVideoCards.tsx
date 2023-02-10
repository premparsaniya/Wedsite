import { forwardRef, Fragment } from "react";

type Props = {
    item: any;
    index: number;
    showPostDetailsClick: (i: any) => void
};

const DiscoverVideoCards = forwardRef(({ item, index, showPostDetailsClick }: Props, ref: any) => {
    const postCardBody = (
        <Fragment key={index}>
            {/* <PostCardWithDetails item={item} /> */}
            <div className="discover-video overflow-hidden" onClick={() => showPostDetailsClick(item)} >
                <img
                    src={item.att_thumb}
                    alt=""
                    className="h-full w-full object-cover cursor-pointer"
                    crossOrigin="anonymous"
                />
            </div>
        </Fragment>
    );
    const content = ref ? (
        <div ref={ref}>{postCardBody}</div>
    ) : (
        <div>{postCardBody}</div>
    );
    return content;
});

export default DiscoverVideoCards