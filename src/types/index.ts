import { Dispatch } from "react";
import { ActionType } from "context";


interface IAppState {
    myWallet: WalletType;
};

interface IAppContext {
    state: IAppState;
    dispatch: Dispatch<IAction>;
};

type WalletType = {
    address: null | string;
    privateKey: null | string;
    publicKey: null | string;
    loadingWallet: boolean;
    isMainNet: boolean;
    wBalances: wBalancesType;
};

type wBalancesType = {
    ethVal: string;
    ethUsd: string;
    stateBalance: string;
    stateUsd: string;
};

type IAction = {
    type: ActionType;
    myWallet?: WalletType;
};

export type { WalletType, IAction, IAppState, IAppContext, wBalancesType };