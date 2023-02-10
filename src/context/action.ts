import { Dispatch } from "react";
import { IAction, WalletType } from "types";

enum ActionType {
    SET_WALLET = 'SET_WALLET',
    RESET = 'RESET'
};

const setWallet = (dispatch: Dispatch<IAction>, myWallet: WalletType) => dispatch({ type: ActionType.SET_WALLET, myWallet });
const resetUser = (dispatch: Dispatch<IAction>) => dispatch({ type: ActionType.RESET });

export { ActionType, setWallet, resetUser };