import { IAction, IAppState } from "types";
import { initialState } from "~/utils";
import { ActionType } from "./action";

const appReducer = (state: IAppState, action: IAction): typeof initialState => {

    switch (action.type) {
        case ActionType.SET_WALLET: {
            return {
                ...state,
                myWallet: action.myWallet ?? state.myWallet
            }
        }
        case ActionType.RESET: {
            return {
                ...state,
                myWallet: {...initialState.myWallet, loadingWallet: false }
            }
        }
        default: return state
    }
};

export default appReducer;