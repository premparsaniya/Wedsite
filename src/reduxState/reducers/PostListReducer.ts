const initialState: any[] = [];

const PostListReducer = (postData = initialState, action: { type: any; payload: any; }) => {

    switch (action.type) {
        case 'POST_LIST':
            return action.payload
        default: return postData
    }
}

export default PostListReducer;