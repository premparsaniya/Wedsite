import { IAppState } from "types";
const {
    VITE_MAINNET_URL,
    VITE_INFURA_KEY,
    VITE_GOERIL_TEST_URL,
    VITE_GOERIL_TEST_INFURA_KEY,
    VITE_BALANCE_ETH_COIN,
    VITE_EHTER_SCAN_API_KEY
} = import.meta.env;

const mainNetURL = `${VITE_MAINNET_URL}${VITE_INFURA_KEY}`;
const goerlyTestNetURL = `${VITE_GOERIL_TEST_URL}${VITE_GOERIL_TEST_INFURA_KEY}`;
const USDbalanceOfEth = `${VITE_BALANCE_ETH_COIN}${VITE_EHTER_SCAN_API_KEY}`;

const initialState: IAppState = {
    myWallet: {
        address: null, privateKey: null, publicKey: null, loadingWallet: true, isMainNet: true,
        wBalances: { ethVal: "0", ethUsd: "0", stateBalance: "0", stateUsd: "0" }
    }
};

export { initialState, mainNetURL, goerlyTestNetURL, USDbalanceOfEth };