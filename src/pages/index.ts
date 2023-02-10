import { lazy } from "react";

const Login = lazy(() => import("./Login"));
const SignUp = lazy(() => import("./SignUp"));
const Home = lazy(() => import("./Home"));
const ForgotPassword = lazy(() => import("./ForgotPassword"));
const Error = lazy(() => import("./Error"));
const EditUProfile = lazy(() => import("./EditUProfile"));
const Playground = lazy(() => import("./Playground"));
const VerifyOTP = lazy(() => import("./VerifyOTP"));
const SetPassword = lazy(() => import("./SetPassword"));
const SaveBookMark = lazy(() => import("./SaveBookMark"));
const HiddenPost = lazy(() => import("./HiddenPost"));
const BlockUsers = lazy(() => import("./BlockUsers"));
const DeleteAccount = lazy(() => import("./DeleteAccount"));
const PrivacyPolicy = lazy(() => import("./PrivacyPolicy"));
const AboutUs = lazy(() => import("./AboutUs"));
const PostDetails = lazy(() => import("./PostDetails"));
const Discover = lazy(() => import("./Discover"));
const Notification = lazy(() => import("./Notification"));
const Wallet = lazy(() => import("./Wallet"));
const CreateWallet = lazy(() => import("./Wallet/CreateWallet"));
const NFT = lazy(() => import("./Wallet/NFT"));
const NFTDetails = lazy(() => import("./Wallet/NFTDetails"));
const SendSTATE = lazy(() => import("./Wallet/SendSTATE"));
const SendETH = lazy(() => import("./Wallet/SendETH"));
const History = lazy(() => import("./Wallet/History"));
const Messages = lazy(() => import("./Messages"));
const TermsConditions = lazy(() => import("./TermsConditions"));
const SharePopup = lazy(() => import("../components/SharePopup"));

export {
  Login,
  SignUp,
  Home,
  ForgotPassword,
  Error,
  PrivacyPolicy,
  Playground,
  VerifyOTP,
  SetPassword,
  SaveBookMark,
  HiddenPost,
  BlockUsers,
  AboutUs,
  DeleteAccount,
  EditUProfile,
  Discover,
  Wallet,
  Notification,
  CreateWallet,
  NFT,
  NFTDetails,
  Messages,
  SendSTATE,
  SendETH,
  History,
  TermsConditions,
  SharePopup,
  PostDetails,
};
