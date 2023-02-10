import { Dispatch } from "react";
import { resetUser, setWallet } from '~/context';
import { IAction, WalletType } from '~/types';
import { ethers } from 'ethers';
import Crypto from './crypto';
import Web3API from 'web3';
import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";
import { goerlyTestNetURL, mainNetURL } from "~/utils";
const {
  VITE_ENCRIPT_KEY,
  VITE_EHTER_SCAN_API_KEY,
  VITE_STATE_COIN_CONTRACT_ADDRESS,
  VITE_GOERIL_ETH_COIN_TRANSACTION_HISTORY_API,
  VITE_MAINNET_STATE_COIN_TRANSACTION_HISTORY_API,
  VITE_NFT_ITEM_API_URL,
  VITE_NFT_API_URL,
  VITE_NFT_OWNERSHIP_API_URL,
  VITE_MAINNET_ETH_COIN_TRANSACTION_RECEIPT_API,
  VITE_GOERIL_ETH_COIN_TRANSACTION_RECEIPT_API
} = import.meta.env;


function ab2str(buf: ArrayBuffer) {
  return String.fromCharCode.apply(null, new Uint16Array(buf) as any);
};

const maxSize = (size: number) => ((size / 1024) / 1024) > 20;

// calclute video duration from File in seconds
const getVideoDuration = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const media = new Audio(reader.result as string);
      media.onloadedmetadata = () => resolve(media.duration);
    };
    reader.readAsDataURL(file);
    reader.onerror = (error) => reject(error);
  })

  // return Promise with proper type
  /*  return new Promise<number>((resolve, reject) => {
     const reader = new FileReader();
     const res = reader.result;
     if (typeof res === null) {
       reject(new Error('Not a valid file!'));
     } else {
       if (res === '') {
         reject(new Error('File is empty!'));
       }
       let strRes = typeof res === 'string' ? res : res?.toString();
       reader.onload = () => {
         const media = new Audio(strRes);
         media.onloadedmetadata = () => resolve(media.duration);
       };
       reader.readAsDataURL(file);
       reader.onerror = (error) => reject(error);
     }
   }); */
}
type FollowType = {
  typeFollow: number,
  typeFollowBack: number,
  typeUnfollow: number,
  typeRequestSent: number,
  typeGotRequest: number,
  typeAccept: number,
  typeReject: number,
  typeCancel: number,

}
enum FollowEnum {
  typeFollow,
  typeFollowBack,
  typeUnfollow,
  typeRequestSent,
  typeGotRequest,
  typeAccept,
  typeReject,
  typeCancel,
}

const buttonCheck = (user1Status: string, user2Status: string) => {
  if ((user1Status === null && user2Status === null) || (user1Status === "" && user2Status === "")) {
    return FollowEnum.typeFollow

  } else if ((user1Status === "accepted" && user2Status === null) || (user1Status === "accepted" && user2Status === "")) {
    // UN FOLLOW
    return FollowEnum.typeUnfollow

  } else if ((user1Status === null && user2Status === "accepted") || (user1Status === "" && user2Status === "accepted")) {
    // FOLLOW BACK
    return FollowEnum.typeFollowBack

  } else if ((user1Status === "pending" && user2Status === null) || (user1Status === "pending" && user2Status === "")) {
    // REQUEST SENT
    return FollowEnum.typeRequestSent

  } else if ((user1Status === null && user2Status === "pending") || (user1Status === "" && user2Status === "pending")) {
    // ACCEPT / REJECT REQUESRT
    return FollowEnum.typeGotRequest

  } else if (user1Status === "pending" && user2Status === "accepted") {
    // REQUEST SENT
    return FollowEnum.typeRequestSent

  } else if (user1Status === "accepted" && user2Status === "pending") {
    // ACCEPT / REJECT REQUESRT
    return FollowEnum.typeGotRequest

  } else if (user1Status === "accepted" && user2Status === "accepted") {
    // UN FOLLOW
    return FollowEnum.typeUnfollow
  }
  return FollowEnum.typeFollow
};

const encryptKeyFnc = async (key: string) => {
  return await Crypto.encrypt(VITE_ENCRIPT_KEY, key);
};

const decryptKeyFnc = async (key: string) => {
  return await Crypto.decrypt(VITE_ENCRIPT_KEY, key);
};



const setKeysToLocalStorage = async (wallet: ethers.Wallet) => {
  const privateKey = wallet.privateKey;
  const publicKey = wallet.publicKey;
  const address = wallet.address;
  const isMainNet = true;
  const encryptedPrivateKey = await encryptKeyFnc(wallet.privateKey);
  const encryptedPublicKey = await encryptKeyFnc(wallet.publicKey);
  const encryptedAddress = await encryptKeyFnc(wallet.address);
  const encryptedIsMainNet = await encryptKeyFnc(isMainNet ? "yesMain" : "notMain");
  localStorage.setItem('@privateKey', encryptedPrivateKey);
  localStorage.setItem('@publicKey', encryptedPublicKey);
  localStorage.setItem('@address', encryptedAddress);
  localStorage.setItem('@isMainNet', encryptedIsMainNet);
  return { privateKey, publicKey, address, encryptedPrivateKey, encryptedPublicKey, encryptedAddress }
};

const getKeysFromLocalStorage = async () => {
  const encryptedPrivateKey = localStorage.getItem('@privateKey');
  const encryptedPublicKey = localStorage.getItem('@publicKey');
  const encryptedAddress = localStorage.getItem('@address');
  const encryptedIsMainNet = localStorage.getItem('@isMainNet');
  // console.log('encryptedPrivateKey', encryptedPrivateKey, 'encryptedPublicKey', encryptedPublicKey, 'encryptedAddress', encryptedAddress);
  if (encryptedPrivateKey && encryptedPublicKey && encryptedAddress && encryptedIsMainNet) {
    const privateKey = await decryptKeyFnc(encryptedPrivateKey);
    const publicKey = await decryptKeyFnc(encryptedPublicKey);
    const address = await decryptKeyFnc(encryptedAddress);
    const isMainNet = await decryptKeyFnc(encryptedIsMainNet);
    return { privateKey, publicKey, address, isMainNet: isMainNet === 'yesMain' /* Boolean(JSON.parse(isMainNet)) */ }
  }
  return null;
};

const removeKeysFromLocalStorage = async () => {
  await Promise.all([
    localStorage.removeItem('@privateKey'),
    localStorage.removeItem('@publicKey'),
    localStorage.removeItem('@address'),
    localStorage.removeItem('@isMainNet'),
  ]).then(() => {
    return true;
  }).catch(() => {
    return false;
  })
};

interface getWalletType {
  myWallet: WalletType;
  dispatch: Dispatch<IAction>;
  phaseType?: number;
  net?: boolean;
  nivigate?: NavigateFunction;
}

const getWallet = async ({ myWallet, dispatch, phaseType, net, nivigate }: getWalletType) => {
  !myWallet.loadingWallet && setWallet(dispatch, { ...myWallet, loadingWallet: true });
  return await getKeysFromLocalStorage().then(res => {
    let def = { "Hex": "", "HaxRandomArr": [] };
    if (res !== null) {
      let { address, privateKey, publicKey, isMainNet } = res;
      setWallet(dispatch, { ...myWallet, address, privateKey, publicKey, loadingWallet: false, isMainNet });
      nivigate && nivigate("/wallet", { replace: true });
      return def;
    } else {
      resetUser(dispatch);
      if (phaseType && net !== undefined) {
        const Web3 = new Web3API(net === true ? mainNetURL : goerlyTestNetURL);
        const Hex = ethers.utils.entropyToMnemonic(Web3.utils.randomHex(phaseType));
        const HaxRandomArr = Hex.split(" ").sort(() => Math.random() - 0.5)
        return { Hex, HaxRandomArr }
      } return def;
    }
  });
};

interface createWalleType {
  mnemonicArr: string[];
  selectedWords: string[];
  mnemonic: string;
  setCreating: (b: boolean) => void;
  nivigate: NavigateFunction;
  dispatch: Dispatch<IAction>;
  myWallet: WalletType;
  setVisible: (b: boolean) => void;
};
const createWallet = async ({ mnemonicArr, selectedWords, mnemonic, setCreating, nivigate, dispatch, myWallet, setVisible }: createWalleType) => {
  if (mnemonicArr.length > 0) { toast.error("Please select all words", { position: "top-center" }); return; }
  const mnemonicStr = selectedWords.join(" ");
  if (mnemonic !== mnemonicStr) { toast.error("Invalid mnemonic code", { position: "top-center" }); return; }
  setCreating(true);
  setTimeout(async () => {
    try {
      const wallet = ethers.Wallet.fromMnemonic(mnemonicStr);
      await setKeysToLocalStorage(wallet).then(({ address, privateKey, publicKey }) => {
        setWallet(dispatch, { ...myWallet, address, privateKey, publicKey, loadingWallet: false });
        toast.success("Wallet created successfully", { position: "top-center" }); setVisible(false);
        nivigate("/wallet", { replace: true });
      }).catch(e => toast.error(e?.message || "Something went wrong", { position: "top-center" })).finally(() => setCreating(false));
    } catch (error) {
      toast.error("Invalid mnemonic code", { position: "top-center" });
      console.error("error:", error); setCreating(false);
    }
  }, 450);
};

interface importWalletType {
  myWallet: WalletType;
  dispatch: Dispatch<IAction>;
  mnemonicKey: string;
  usingMnemonic: boolean;
  setImporting: (b: boolean) => void;
  setVisible: (b: boolean) => void;
  setMnemonicKey: (s: string) => void;
};
const importWallet = ({ myWallet, dispatch, mnemonicKey, usingMnemonic, setImporting, setVisible, setMnemonicKey }: importWalletType) => {
  if (mnemonicKey === "") return toast.error(`Please enter ${usingMnemonic ? "mnemonic code" : "primary key"}`, { position: "top-center" });
  setImporting(true);
  setTimeout(async () => {
    try {
      let wallet = usingMnemonic ? ethers.Wallet.fromMnemonic(mnemonicKey) : new ethers.Wallet(mnemonicKey);
      await setKeysToLocalStorage(wallet).then(({ address, privateKey, publicKey }) => {
        setWallet(dispatch, { ...myWallet, address, privateKey, publicKey, loadingWallet: false });
        toast.success("Wallet imported successfully", { position: "top-center" }); setVisible(false); setMnemonicKey("");
      }).catch(() => toast.error("Something went wrong", { position: "top-center" })).finally(() => setImporting(false));
    } catch (error: any) {
      toast.error(error ? error?.message : `Invalid ${usingMnemonic ? "mnemonic code" : "Privae key"}`, { position: "top-center" }); console.error("error:", error); setImporting(false);
    }
  }, 450);
};

const getNFTs = async (address: string) => {
  const url = `${VITE_NFT_API_URL}${address}`;
  return await fetch(url).then(res => res.json()).then(data => {
    return { data, err: null };
  }).catch(e => { console.error("error:", e); return { data: null, err: e } });
};

const getNFT = async (Id: string) => {
  const url = `${VITE_NFT_ITEM_API_URL}${Id}`;
  return await fetch(url).then(res => res.json()).then(data => {
    return { data, err: null };
  }).catch(e => { console.error("error:", e); return { data: null, err: e } });
};
const getOwnship = async (address: string) => {
  const url = `${VITE_NFT_OWNERSHIP_API_URL}${address}`;
  return await fetch(url).then(res => res.json()).then(data => {
    return { data, err: null };
  }).catch(e => { console.error("error:", e); return { data: null, err: e } });
};

const getTransactionStatus = async (hash: string, isMainNet: boolean) => {
  const url = `${isMainNet ? VITE_MAINNET_ETH_COIN_TRANSACTION_RECEIPT_API : VITE_GOERIL_ETH_COIN_TRANSACTION_RECEIPT_API}${hash}&apikey=${VITE_EHTER_SCAN_API_KEY}`;
  return await fetch(url).then(res => res.json()).then(data => {
    return { data, err: null };
  }).catch(e => { console.error("error:", e); return { data: null, err: e } });
};

type numStr = number | string;

interface getHistoryType {
  wAddress: string;
  pg: numStr;
  offset: numStr;
  sort?: string;
  isMainNet?: boolean;
}

const getEthTransationHistory = async ({ wAddress, pg, offset, sort = "desc" }: getHistoryType) => {
  return `${VITE_GOERIL_ETH_COIN_TRANSACTION_HISTORY_API}${wAddress}&page=${pg}&offset=${offset}&sort=${sort}&apikey=${VITE_EHTER_SCAN_API_KEY}`
};

const getStateTransationHistory = async ({ wAddress, pg, offset, sort = "desc" }: getHistoryType) => {
  return `${VITE_MAINNET_STATE_COIN_TRANSACTION_HISTORY_API}${VITE_STATE_COIN_CONTRACT_ADDRESS}&address=${wAddress}&page=${pg}&offset=${offset}&sort=${sort}&apikey=${VITE_EHTER_SCAN_API_KEY}`;
};

const getHistory = async ({ wAddress, pg, offset, isMainNet, sort = "desc" }: getHistoryType) => {
  let obj = { wAddress, pg, offset, sort };
  const url = isMainNet ? await getStateTransationHistory(obj) : await getEthTransationHistory(obj);
  return await fetch(url).then(res => res.json()).then(data => {
    return { data, err: null };
  }).catch(e => { console.error("error:", e); return { data: null, err: e } });
};

const onCopy = (s: string | null) => {
  if (s) { navigator.clipboard.writeText(s ?? ""); toast.success("Copied to clipboard", { position: "top-center" }); }
  else toast.error("Error", { position: "top-center" });
};

const openUrl = (url: string) => window.open(url, "_blank");

// get any first image from the array
const getFirstKeyVal = (arr: any[], key: string, type: "IMAGE" | "VIDEO") => arr.find(item => item[key] === type)?.url || "";

const tokenValueFromWei = (value: string, decimal: string | null = null) => {
  return decimal ? (parseFloat(value) / Math.pow(10, parseInt(decimal))).toString() : (parseFloat(value) / Math.pow(10, 18)).toString();
};

const tokValFromWeiFormated = (value: string, decimal: string | null = null) => {
  const val = tokenValueFromWei(value || "0", decimal || null);
  return val ? val?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0.00";
};

const changeNetwork = async (isMainNet: boolean, dispatch: Dispatch<IAction>, myWallet: WalletType) => {
  setWallet(dispatch, { ...myWallet, loadingWallet: true, isMainNet });
  let encryptedIsMain = await encryptKeyFnc(isMainNet ? "yesMain" : "notMain");
  localStorage.setItem("@isMainNet", encryptedIsMain);
  setTimeout(async () => {
    setWallet(dispatch, { ...myWallet, loadingWallet: false, isMainNet });
  }, 450);
};



export type { FollowType }
export {
  maxSize, getVideoDuration, buttonCheck, FollowEnum, Crypto, encryptKeyFnc, decryptKeyFnc,
  setKeysToLocalStorage, getKeysFromLocalStorage, removeKeysFromLocalStorage, getWallet,
  ab2str, getEthTransationHistory, onCopy, openUrl, createWallet, importWallet, getNFTs,
  getStateTransationHistory, getNFT, getFirstKeyVal, getOwnship, getHistory, getTransactionStatus,
  tokenValueFromWei, tokValFromWeiFormated, changeNetwork
};