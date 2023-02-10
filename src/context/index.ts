import { createContext } from 'react';
import { IAppContext } from 'types';
import { setWallet, ActionType, resetUser } from './action';
import { AppContextProvider } from './AppContextProvider';

const AppContext = createContext<IAppContext>({
    state: {
        myWallet: {
            address: null,
            privateKey: null,
            publicKey: null,
            loadingWallet: true,
            isMainNet: true,
            wBalances: { ethVal: "0", ethUsd: "0", stateBalance: "0", stateUsd: "0" }
        }
    },
    dispatch: () => { }
});
export { AppContext, setWallet, ActionType, AppContextProvider, resetUser };