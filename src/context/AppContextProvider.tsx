import { FC, ReactNode, useReducer } from "react";
import { AppContext } from "./";
import { initialState } from "~/utils";
import appReducer from "./reducer";
import { IAppState } from "types";

const AppContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState as IAppState);
    const val = { state, dispatch };

    return (
        <AppContext.Provider value={val}>{children}</AppContext.Provider>
    )
};

export { AppContextProvider };