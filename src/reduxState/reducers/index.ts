
import UserLogin from "./RLogin";
import LoadingRedux from "./LoadingRedux";
import MyPostReducer from "./MyPostReducer";
import PostListReducer from "./PostListReducer";
import GetPostListToggleReducer from "./GetPostListToggleReducer";
import pageReducer from "./PageReducer"
import { combineReducers } from "@reduxjs/toolkit";

const AppReducers = combineReducers({
    UserLogin,
    LoadingRedux,
    MyPostReducer,
    PostListReducer,
    GetPostListToggleReducer,
    pageReducer
});

export { AppReducers, UserLogin, LoadingRedux, MyPostReducer, PostListReducer, GetPostListToggleReducer, pageReducer };