import express, { Express } from "express";
import config from "config";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import logger from "./utils/logger";
import connect from "./utils/connect";
import routes from "./utils/routes";
import cookieParser from "cookie-parser";
const app: Express = express();
dotenv.config();
app.use(cors(config.get<CorsOptions>("corsOptions")));
app.use(express.json());
app.use(cookieParser());
const PORT = config.get<number>("PORT") || 5000;

app.listen(PORT, async () => {
  console.log("The environment is", process.env.NODE_ENV);
  logger.info(`Server running at Port: ${PORT}`);
  await connect();
  routes(app);
});
