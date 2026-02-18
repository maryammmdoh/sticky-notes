import CryptoJS from "crypto-js";
import { ENC_SECRET } from "../../config/config.service.js";

export const encrypt = (value) => {
  if (!ENC_SECRET) {
    throw new Error(
      "Encryption secret key is not defined in environment variables.",
    );
  }

  return CryptoJS.AES.encrypt(value, ENC_SECRET).toString();
};

export const decrypt = (encryptedValue) => {
  const bytes = CryptoJS.AES.decrypt(encryptedValue, ENC_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};
