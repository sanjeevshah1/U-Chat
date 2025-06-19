import fs from "fs";
const publicKey = fs.readFileSync("./public.pem", "utf-8");
const privateKey = fs.readFileSync("./private.pem", "utf-8");
export default {
  PORT: 1337,
  mongoUrl:
    "mongodb+srv://sahsanjeev42:jdzvwLNfiIbxSmiA@uchat-cluster.zdx5bcp.mongodb.net/?retryWrites=true&w=majority&appName=uchat-cluster",
  corsOptions: {
    origin: "http://localhost:5173",
    credentials: true,
  },
  saltFactor: 10,
  publicKey: publicKey,
  privateKey: privateKey,
};
