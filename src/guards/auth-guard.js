import { store } from "../redux/store";
// import { decodeToken, logout } from "../helper-methods/index";

export const isUserAuthenticated = () => {
  const state = store.getState();
  let isUserAuth = false;

  if (state?.userCredential?.token) {
    // const tokenData = decodeToken(state.userCredential.token);

    // const expDate = new Date(tokenData["exp"] * 1000); // expire in sec. convert in msec.

    // if (expDate <= new Date()) {
    // console.log("token expire...");
    // logout();
    // } else {
    isUserAuth = true;
    // }
  }

  return isUserAuth;
};
