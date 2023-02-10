import { forwardRef } from "react";
import { PostCardWithDetails } from "../../components";


/**
 * this content used to pagination on planned shipment data from api
 */
type Props = {
    item: any;
    index: number;
    getBookMarkList?: () => void
};

const SaveBookMarkContent = forwardRef(({ item, index, getBookMarkList = () => { } }: Props, ref: any) => {
    const postCardBody = (
        <PostCardWithDetails key={index} item={item} getBookMarkList={getBookMarkList} />
    );
    const content = ref ? (
        <div ref={ref}>{postCardBody}</div>
    ) : (
        <div >{postCardBody}</div>
    );

    return content;
});

export default SaveBookMarkContent;
