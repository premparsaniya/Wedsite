const initialState: boolean = false;

const GetPostListToggleReducer = (postListToggle = initialState, action: { type: any; payload: any; }) => {

    switch (action.type) {
        case 'POST_LIST_TOGGLE':
            return action.payload
        default: return postListToggle
    }
}

export default GetPostListToggleReducer;