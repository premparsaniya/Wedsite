import { AppReducers } from "./reducers";
import { persistStore, persistReducer } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { useDispatch } from "react-redux";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ["user", "UserLogin"]
};

const persistReducers = persistReducer(persistConfig, AppReducers);


const store = configureStore({
    "reducer": persistReducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export type App_state = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const persistor = persistStore(store);
const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
export { persistor, useAppDispatch };