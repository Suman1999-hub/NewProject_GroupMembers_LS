import {
  makeGetRequest,
  makePostRequest,
  // makePutRequest,
  // uploadFile,
  // makeDeleteRequest,
  // uploadFileMultiPart
} from "./http-service";
import { BASE_URL } from "../config/index";

export const login = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(`${BASE_URL}/login`, false, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const forgotPassword = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(`${BASE_URL}/forgotpassword`, false, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const requestInvitation = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(`${BASE_URL}/signup`, false, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

/**
 * @param {string} platform - google or facebook
 * @param {object} payload - {accessToken: google or facefook response token}
 * @returns
 */
export const socialLogin = (platform, payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(`${BASE_URL}/${platform}/signup`, false, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

/**
 * used for check availability of phone or email or username
 *
 * @param {string} payload - phone or email or username
 * @returns
 */
export const checkAvailability = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(`${BASE_URL}/unique`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const getLoggedInUserDetail = () => {
  return new Promise((resolve, reject) => {
    makeGetRequest(`${BASE_URL}/user`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const sendEmailTextToUsers = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(`${BASE_URL}/email`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};
//Post Call Members
export const findMembers = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(`${BASE_URL}/find/members`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const findAllGroups = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(`${BASE_URL}/find/groups`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};
