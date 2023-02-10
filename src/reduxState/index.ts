import { App_state, persistor, useAppDispatch, AppDispatch } from "./store";
import { LoginUser, LogoutUser, Load, getMyPost, LogoutUserPost, likePost, setPostList, setGetPostListToggle ,setPageNumber} from "./action";

export type { App_state, AppDispatch };
export { persistor, useAppDispatch, LoginUser, LogoutUser, Load, getMyPost, LogoutUserPost, likePost, setPostList, setGetPostListToggle ,setPageNumber};