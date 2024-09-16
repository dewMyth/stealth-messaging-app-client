var CryptoJS = require("crypto-js");

export const formatEpochToDate = (epoch) => {
  // Convert Unix epoch (seconds) to milliseconds
  const date = new Date(epoch * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const encryptMessage = (text, secretKey) => {
  // Encrypt
  var encryptedMessage = CryptoJS.AES.encrypt(text, secretKey).toString();
  return encryptedMessage;
};

export const decryptMessage = (encryptedText, secretKey) => {
  // Decrypt
  var decryptedMessage = CryptoJS.AES.decrypt(
    encryptedText,
    secretKey
  ).toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
};
