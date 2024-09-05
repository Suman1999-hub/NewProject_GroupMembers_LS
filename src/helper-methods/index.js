import jwt_decode from "jwt-decode";
import toast from "react-hot-toast";
import _deepClone from "clone-deep";
import moment from "moment";
import ReactCopyToClipboard from "copy-to-clipboard";
import ReactHtmlParser from "react-html-parser";

import { store as REDUX_STORE } from "../redux/store";
import { clearUserCredential } from "../redux/actions/userCredential";
import { getToken } from "../http/token-interceptor";
import { AWS_IMAGE_BUCKET_NAME, BASE_URL } from "../config";
import { PostManager } from "../aws/post-manager";
import { UploadQueueManager } from "../aws/upload-queue-manager";
import S3BucketUploader from "../aws/s3-bucket-uploader";

export const logout = (navigate = null) => {
  REDUX_STORE.dispatch(clearUserCredential());

  if (navigate) navigate("/login", { replace: true });
  else window.location.reload();
};

export const decodeToken = (token) => {
  return jwt_decode(token);
};

export const structureQueryParams = (params) => {
  let queryStrings = "?";
  const keys = Object.keys(params);
  keys.forEach((key, index) => {
    queryStrings += key + "=" + params[key];
    if (params[keys[index + 1]]) {
      queryStrings += "&";
    }
  });
  return queryStrings;
};

export const extractQueryParams = () => {
  let {
    location: { search: queryParamString },
  } = window;
  let params = {};
  if (queryParamString.length > 1 && queryParamString.indexOf("?") > -1) {
    queryParamString = queryParamString.replace("?", "");
    queryParamString = decodeURIComponent(queryParamString);
    if (queryParamString.indexOf("&") === -1) {
      // Contains only one param
      const paramParts = queryParamString.split("=");
      params[paramParts[0]] = paramParts[1];
    } else {
      // Contains multiple params
      const queryParams = queryParamString.split("&");
      queryParams.forEach((queryParam) => {
        const paramParts = queryParam.split("=");
        params[paramParts[0]] = paramParts[1];
      });
    }
  }
  return params;
};

export const showToast = (message, type = "error", duration = 4000) => {
  toast[type](message, { duration });
};

export const sleepTime = (n) => new Promise((r) => setTimeout(() => r(), n));

export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const capitalizeEveryFirstLetter = (text = "") => {
  const modifiedText = text
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
  return modifiedText;
};

export const deepClone = (data) => {
  return _deepClone(data);
};

export const getPhoneNumberFromBrackets = (number) => {
  let phone = "";
  if (number) {
    if (number.includes("(") && number.includes(")")) {
      phone = number.split(")")[1];
    } else {
      phone = number;
    }
  }
  return phone;
};

export const getPhoneCodeFromBrackets = (number) => {
  let phone = "";
  if (number && number.includes("(") && number.includes(")"))
    phone = number.split(")")[0].slice(1);
  return phone;
};

export const formatPhoneNumber = (phone) => {
  if (phone) {
    if (phone.includes("(") && phone.includes(")")) {
      let phoneSplit = phone.split(")");
      return `${phoneSplit[0].slice(1)} ${phoneSplit[1]}`;
    } else {
      return phone;
    }
  } else {
    return "N/A";
  }
};

export const formatDate = (date) => {
  if (!date) return "";

  if (moment().isSame(date, "year")) {
    return moment(new Date(date)).format("MMM DD");
  } else {
    return moment(new Date(date)).format("MMM DD, YYYY");
  }
};

export const formatDateAndTime = (date) => {
  if (!date) return "";

  if (moment().isSame(date, "year"))
    return moment(new Date(date)).format("MMM DD - hh:mm a");
  else return moment(new Date(date)).format("MMM DD, YYYY - hh:mm a");
};

export const getYesterdayDate = () => {
  return moment().subtract(1, "day");
};

export const formatTime = (date) => {
  if (!date) return "";

  return moment(new Date(date)).format("hh:mm A");
};

export const formatCurrencyValue = (data) => {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  let currency = formatter.format(data);
  if (currency && currency.split(".")[1] === "00") {
    return currency.split(".")[0]; /* $2,500 */
  }
  return currency; /* $2,500.15 */
};

// start: upload file on s3 functions //

export const b64toBlob = (b64Data, contentType, sliceSize) => {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;
  let byteCharacters = atob(b64Data);
  let byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    let slice = byteCharacters.slice(offset, offset + sliceSize);
    let byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export const convertb64Image = (ImageURL, fileName) => {
  // Split the base64 string in data and contentType
  let block = ImageURL.split(";");
  // Get the content type
  let contentType = block[0].split(":")[1]; // In this case "image/gif"
  // get the real base64 content of the file
  let realData = block[1].split(",")[1]; // In this case "iVBORw0KGg...."
  // Convert to blob
  let blob = b64toBlob(realData, contentType);
  // Create a FormData and append the file
  let fd = new FormData();
  fd.append("file", blob, fileName);
  return fd;
};

export const onUploadProgress = (evt, onProgressCallback) => {
  let uploadPercentage = parseInt((evt.loaded * 100) / evt.total) + "%";
  onProgressCallback(uploadPercentage);
};

export const onComplete = (error, success) => {
  console.log("error, success :", error, success);
};

/**
 * To communicate through events
 */
const EventEmitter = {
  events: {},
  dispatch: function (event, data = null) {
    // Check if the specified event is exist / subscribed by anyone
    if (!this.events[event]) {
      // Doesn't exist, so just return
      return;
    } else {
      // Exists
      // Process all bound callbacks
      this.events[event].forEach((callback) => callback(data));
    }
  },
  subscribe: function (event, callback) {
    // Check if the specified event is exist / subscribed by anyone
    if (!this.events[event]) {
      // Not subscribed yet, so make it an array so that further callbacks can be pushed
      this.events[event] = [];
    }
    // Push the current callback
    this.events[event].push(callback);
  },
};

export const onFilePercentageChange = (callback) => {
  EventEmitter.subscribe("upload-file-percentage-change", callback);
};

export const uploadPhotoToCloudinary = (
  photo,
  type = "blob",
  fileName = null,
  fileType = "image",
  isLargeFile = false,
  onProgressCallback = (uploadPercentage) => {
    EventEmitter.dispatch("upload-file-percentage-change", uploadPercentage);
  }
) => {
  return new Promise(async (resolve, reject) => {
    if (type === "blob") {
      fileName = Math.random().toString(36).substring(2);

      fileName =
        fileName +
        (fileType === "image"
          ? ".jpg"
          : fileType === "audio"
          ? ".mp3"
          : ".mp4");

      // const formData = new FormData();
      if (
        fileType === "video" ||
        fileType === "image" ||
        fileType === "audio"
      ) {
        // formData.append("mediafile", photo, fileName);
        const authToken = await getToken();

        try {
          const config = await S3BucketUploader.getCreds(
            `${BASE_URL}/awstempcreds`,
            authToken
          );
          //  Initialize S3 Uploader
          const s3Uploader = new S3BucketUploader(config);
          const s3Response = await s3Uploader.uploadFile(
            photo,
            onComplete,
            (e) => onUploadProgress(e, onProgressCallback),
            fileType
          );
          resolve(s3Response.Location);
        } catch (error) {
          reject(error);
        }
      }
    } else {
      console.log("error>> ", type, " is not equal to blob");
      reject({
        error: true,
        reason: "Something went wrong, Try again after sometime.",
      });
    }
  });
};

// program to get the file extension
export const getFileExtension = (filename) => {
  // get file extension
  const extension = filename.split(".").pop();
  return extension;
};

/**
 * uploadFiles is Object Array;
 * object key is;
 * - uploadData
 * - previewBlob
 * - type
 * - forKeyName (optional) return same value for file matching
 *
 * @param {Array} uploadFiles - file Object Array
 * @returns Array Object; object key is;
 * - name
 * - url
 * - contentType
 * - size
 * - forKeyName (return if provided)
 */
export const uploadFileOnServer = (uploadFiles) => {
  return new Promise((resolve) => {
    console.log("receive uploadFiles>>", uploadFiles);

    const uploadedFiles = [];

    if (uploadFiles && uploadFiles.length) {
      let postID = PostManager.addMediaFilesCount(uploadFiles.length);

      PostManager.onAllMediaFilesUploadCompleted(postID, async (id) => {
        if (id.postID === postID) {
          PostManager.deletePostID(postID);
          resolve(uploadedFiles);
        } else {
          return;
        }
      });

      uploadFiles.forEach((uploadFile) => {
        let mediaData = {};

        if (!uploadFile["type"]) {
          uploadFile["type"] = uploadFile["uploadData"]["type"].split("/")[0];
        }

        if (uploadFile["type"] === "video") {
          mediaData = {
            blobObject: uploadFile["uploadData"],
            blobURL: uploadFile["previewBlob"],
          };
        } else if (
          uploadFile["type"] === "image" ||
          uploadFile["type"] === "pdf"
        ) {
          mediaData = {
            file: uploadFile["uploadData"],
            blobObject: uploadFile["previewBlob"],
          };
        } else if (uploadFile["type"] === "audio") {
          mediaData = {
            file: uploadFile["uploadData"],
            blobObject: { blob: uploadFile["uploadData"] },
          };
        }

        const uploadId = UploadQueueManager.addMediaToQueue(
          mediaData,
          uploadFile.type
        );

        // Listen for upload complete
        UploadQueueManager.onUploadComplete(uploadId, async (mediaResponse) => {
          PostManager.onSingleMediaFileUploadCompleted(postID);
          console.log("mediaResponse", mediaResponse, mediaResponse.fileUrl);
          // Upload complete
          // Get content id from backend
          uploadedFiles.push({
            name: uploadFile.uploadData.name,
            url: mediaResponse.fileUrl,
            contentType:
              uploadFile.type === "pdf"
                ? getFileExtension(uploadFile.uploadData.name)
                : uploadFile.type,
            size: uploadFile.uploadData.size,
            forKeyName: uploadFile.forKeyName,
          });
        });
      });
    }
  });
};

export const getAWSBucketName = (type, isPublic = false) => {
  // if (isPublic) {
  //   switch (type) {
  //     case "image":
  //       return AWS_PUBLIC_IMAGE_BUCKET_NAME;
  //     default:
  //       return null;
  //   }
  // } else {
  switch (type) {
    case "pdf":
    case "image":
      return AWS_IMAGE_BUCKET_NAME;
    // case "video":
    //   return AWS_VIDEO_BUCKET_NAME;
    // case "audio":
    //   return AWS_AUDIO_BUCKET_NAME;
    default:
      return null;
  }
  // }
};

// end: upload file on s3 functions //

export const errorHandler = (error) => {
  console.log("error>>", error);
  showToast(
    error?.reason?.length || error?.message?.length
      ? error?.reason || error?.message
      : "Something went wrong, Try again later."
  );
};

export const splitFullName = (fullName = "") => {
  if (!fullName) return {};

  const splitName = fullName.split(" ");

  return {
    firstName: splitName?.[0]?.trim() || "",
    lastName: splitName?.slice(1)?.join(" ")?.trim() || "",
  };
};

export const getFullName = (name = {}) => {
  return (
    capitalize(name?.first?.trim()) +
    " " +
    capitalize(name?.last?.trim())
  )?.trim();
};

export const openUrlOnNewTab = (url, isOpenDirect = true) => {
  if (!url) return;

  if (isOpenDirect) {
    window.open(url, "_blank");
    return;
  }

  const fullLink =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;

  window.open(fullLink, "_blank");
};

/**
 * Copies the text passed as param to the system clipboard
 * Check if using HTTPS and navigator.clipboard is available
 * Then uses standard clipboard API, otherwise uses fallback
 */
export const copyToClipboard = (content) => {
  if (window.isSecureContext && navigator.clipboard) {
    console.log("isSecureContext");
    navigator.clipboard.writeText(content);
  } else {
    ReactCopyToClipboard(content);
  }
  showToast("Copied", "success");
};

export const reactHtmlParser = (text = "") => {
  try {
    return text ? ReactHtmlParser(text) : "";
  } catch (error) {
    console.log({ error });
    return "";
  }
};

const twoDigitNumber = (num) => {
  return `${num < 10 ? `0${num}` : num}`;
};

/**
 * convert seconds into hh:mm:ss format
 *
 * @param {Number} seconds
 */
export const convertSecondsToHourMinSec = (seconds) => {
  if (!seconds) return "";

  let sec = Math.floor(seconds);

  if (sec < 60) {
    return `00:${twoDigitNumber(sec)}`;
  } else {
    let min = Math.floor(sec / 60);
    sec = sec % 60;
    if (min < 60) {
      return `${twoDigitNumber(min)}:${twoDigitNumber(sec)}`;
    } else {
      let hour = Math.floor(min / 60);
      min = min % 60;
      if (hour < 24) {
        return `${twoDigitNumber(hour)}:${twoDigitNumber(min)}:${twoDigitNumber(
          sec
        )}`;
      } else {
        return "";
      }
    }
  }
};

/**
 * input - address object;
 * address = {
 *  street: String,
 *  line1: String,
 *  line2: String,
 *  city: String,
 *  state: String,
 *  zip: String,
 * }
 *
 * @param {*} address - Object
 * @returns - address in single line text
 */
export const formatAddressInSingleText = (address = {}) => {
  let addressFormat = "";

  if (address?.Line1) {
    addressFormat = addressFormat.trim() + ` ${address?.Line1}`;
  }

  if (address?.Line2) {
    addressFormat = addressFormat.trim() + ` ${address?.Line2}`;
  }

  if (address?.Line3) {
    addressFormat = addressFormat.trim() + ` ${address?.Line3}`;
  }

  if (address?.City) {
    addressFormat = addressFormat.trim() + ` ${address?.City}`;
  }

  if (address?.CountrySubDivisionCode) {
    addressFormat =
      addressFormat.trim() + ` ${address?.CountrySubDivisionCode}`;
  }

  if (address?.PostalCode) {
    addressFormat = addressFormat.trim() + ` ${address?.PostalCode}`;
  }

  if (address?.Country) {
    addressFormat = addressFormat.trim() + ` ${address?.Country}`;
  }

  return capitalize(addressFormat);
};

export const shareLinkOnSocialMedia = ({ type = "", link = "" }) => {
  if (!link) {
    console.log("Link not found");
    return;
  }

  switch (type) {
    case "whatsapp": {
      link += `&pf=whatsapp`;
      openUrlOnNewTab(
        `https://web.whatsapp.com/send?text=${encodeURIComponent(link)}`
      );
      break;
    }
    case "telegram": {
      link += `&pf=telegram`;
      openUrlOnNewTab(
        `https://telegram.me/share/url?url=${encodeURIComponent(link)}`
      );
      break;
    }
    case "instagram": {
      copyToClipboard(`${link}&pf=instagram`);
      setTimeout(() => {
        openUrlOnNewTab(`https://www.instagram.com/`);
      }, 400);
      break;
    }
    case "facebook": {
      link += `&pf=facebook`;
      openUrlOnNewTab(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          link
        )}`
      );
      break;
    }
    case "twitter": {
      link += `&pf=twitter`;
      openUrlOnNewTab(
        `https://twitter.com/share?url=${encodeURIComponent(link)}`
      );
      break;
    }
    case "linkedin": {
      link += `&pf=linkedin`;
      openUrlOnNewTab(
        `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(link)}`
      );
      break;
    }
    case "email": {
      link += `&pf=email`;
      openUrlOnNewTab(
        `mailto:?subject=I wanted you to see this site&body=Check out this site ${encodeURIComponent(
          link
        )}.`
      );
      break;
    }
    default: {
      console.log("Invalid Query >> ", { type, link });
    }
  }
};

export const getDropdownColor = (status = "") => {
  if (!status) return "";

  status = status.toLowerCase();

  switch (status) {
    case "active":
    case "arrived": {
      return "success";
    }
    case "pending":
    case "inactive": {
      return "warning";
    }
    case "cancelled": {
      return "danger";
    }
    default: {
      return "primary";
    }
  }
};
