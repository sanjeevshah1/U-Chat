import express from "express";
import config from "config";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import logger from "./utils/logger";
import connect from "./utils/connect";
import routes from "./utils/routes";
import cookieParser from "cookie-parser";
import { deserializeUser } from "./middlewares/deserealizeUser";
import { app, server } from "./utils/socket";

dotenv.config();
app.use(cors(config.get<CorsOptions>("corsOptions")));
app.use(express.json());
app.use(cookieParser());
app.use(deserializeUser);
const PORT = config.get<number>("PORT") || 5000;

server.listen(PORT, async () => {
  logger.info(`Server running at Port: ${PORT}`);
  await connect();
  routes(app);
});
