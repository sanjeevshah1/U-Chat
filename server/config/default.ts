import fs from "fs";
const publicKey = fs.readFileSync("./public.pem", "utf-8");
const privateKey = fs.readFileSync("./private.pem", "utf-8");
export default {
  PORT: 1337,
  mongoUrl: "mongodb://localhost:27017/u-chat",
  corsOptions: {
    origin: "*",
  },
  saltFactor: 10,
  publicKey: publicKey,
  privateKey: privateKey,
};
