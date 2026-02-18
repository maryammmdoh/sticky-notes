import dotenv from "dotenv";
import path from "path";

export const NODE_ENV = process.env.NODE_ENV;

const envPath = {
  dev: path.resolve("./config/.env.dev"),
  prod: path.resolve("./config/.env.prod"),
};
dotenv.config({ path: envPath[NODE_ENV] });

export const SERVER_PORT = process.env.PORT || 3000;
export const DB_URL = process.env.DB_URL;
export const ENC_SECRET = process.env.ENC_SECRET;
export const JWT_SECRET = process.env.JWT_SECRET;

