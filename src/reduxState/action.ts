const LoginUser = (response: any) => {
    return {
        type: 'LOGIN',
        payload: response,
    }
}

const LogoutUser = () => {
    return { type: 'LOGOUT' }
}

// const SignUpUser = (Obj) => {
//     return { type: 'SIGN', payload: Obj }
// }

const Load = (bool: any) => {
    return {
        type: 'LOADING',
        payload: bool
    }
}

const getMyPost = (response: any) => {
    return { type: 'UPDATEPOST', payload: response }
}
const LogoutUserPost = () => {
    return { type: 'LOGOUT' }
}
const likePost = (response: any) => {
    return { type: 'LIKE', payload: response }
}

const setPostList = (response: any[]) => {
    return { type: 'POST_LIST', payload: response }
}

const setGetPostListToggle = (response: boolean) => {
    return { type: 'POST_LIST_TOGGLE', payload: response }
}

const setPageNumber = (response: number) => {
    return { type: "PAGE_NUMBER", payload: response }
}

export { LoginUser, LogoutUser, Load, getMyPost, LogoutUserPost, likePost, setPostList, setGetPostListToggle ,setPageNumber};