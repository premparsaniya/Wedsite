import React from "react";
import { forwardRef } from "react";
import { PostCards } from "../../components";

/**
 * this content used to pagination on planned shipment data from api
 */
type Props = {
  item: any;
  index: number;
  getPostList: () => void;  
};

const PostCardsContent = forwardRef(
  ({ item, index, getPostList,}: Props, ref: any) => {
    const postCardBody = (
      <PostCards
        index={index}
        val={item}
        getPostList={getPostList}        
      />
    );
    const content = ref ? (
      <div
        className="home-card "
        /* className="max-w-500px min-w-auto"  */ ref={ref}
      >
        {postCardBody}
      </div>
    ) : (
      <div className="home-card" /* className="max-w-500px min-w-auto" */>
        {postCardBody}
      </div>
    );

    return content;
  }
);

export default PostCardsContent;
