import {
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
  Messages,
  SendETH,
  SendSTATE,
  NFT,
  NFTDetails,
  History,
  TermsConditions,
  PostDetails,
} from "../pages";
import {
  NavBar,
  UserProfile,
  UserAccountPostPreview,
  Loading,
  SpinningLoader,
} from "../components";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { App_state } from "~/reduxState";
import { Suspense } from "react";
import PostList from "~/pages/PostList";

const Index = () => {
  const { user } = useSelector((s: App_state) => s.UserLogin);

  function FallbackLoader() {
    return (
      <div className="flex h-[80vh] flex-col w-full items-center justify-center py-9">
        <SpinningLoader isLoading colClass="text-black" size={10} />
      </div>
    );
  }

  return (
    <>
      {user.data.user_id && <NavBar />}
      <Suspense fallback={<FallbackLoader />}>
        <ToastContainer />
        <Routes>
          {user.data.user_id ? (
            <>
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reset" element={<ForgotPassword />} />
              <Route path="/*" element={<Error />} />
              <Route path="/" element={<Home />} />              
              <Route path="/playground" element={<Playground />} />
              <Route path="/userprofile/:id" element={<UserProfile />} />
              <Route path="/uapp/:id" element={<UserAccountPostPreview />} />
              {/* <Route path="/postdetails/:id" element={<PostDetails />} /> */}
              <Route path="/uapp/ep/:id/:general" element={<EditUProfile />} />
              <Route path="/ep/:id/:general" element={<SaveBookMark />} />
              <Route path="/:id/:general" element={<HiddenPost />} />
              <Route path="/uapp/ep/:id/:general" element={<BlockUsers />} />
              <Route path="/uapp/ep/:id/:general" element={<DeleteAccount />} />
              <Route path="/uapp/ep/:id/:general" element={<PrivacyPolicy />} />
              <Route path="/uapp/ep/:id/:general" element={<AboutUs />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/postlist/:id" element={<PostList />} />

              <Route path="/VerifyOTP" element={<VerifyOTP />} />
              <Route path="/setPassword" element={<SetPassword />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:chatroomId" element={<Messages />} />              
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/wallet/create" element={<CreateWallet />} />
              <Route path="/wallet/send-state" element={<SendSTATE />} />
              <Route path="/wallet/send-eth" element={<SendETH />} />
              <Route path="/wallet/NFT" element={<NFT />} />
              <Route path="/wallet/NFT/:id" element={<NFTDetails />} />
              <Route path="/wallet/history" element={<History />} />
              {/* <Route path="/uapp/ep/:id" element={<EditUProfile />}/> */}
              {/* <Route path="/uapp/ep/:id/:gen" element={<EdProfile />}/> */}
              {/* <Route path="/uapp/ep/:id/" element={<CngPassword />}/> */}
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reset" element={<ForgotPassword />} />
              <Route path="/*" element={<Navigate to="/login" replace />} />
              <Route path="/VerifyOTP" element={<VerifyOTP />} />
              <Route path="/setPassword" element={<SetPassword />} />
              <Route
                path="/Terms_and_Conditions"
                element={<TermsConditions />}
                />

                {/* <Route path="*" element={<Error />} /> */}
              {/* <Route path="/" element={<Home />} /> */}
              {/* <Route path="/userprofile" element={<Navigate to="/login" />} /> */}
              {/* <Route path="/createpost" element={<Navigate to="/login" />} /> */}
              {/* <Route path="/userprofile" element={<UserProfile/>} /> */}
              {/* <Route path="/abc" element={<ABC />} /> */}
            </>
          )}
        </Routes>
      </Suspense>
    </>
  );
};

export default Index;
