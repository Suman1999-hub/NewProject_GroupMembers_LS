import { store } from "../redux/store";

export const getToken = () => {
  return new Promise((resolve, reject) => {
    let token = null;

    const { userCredential } = store.getState();

    if (userCredential?.token) {
      token = userCredential.token;
    }

    resolve(token);
  });
};
