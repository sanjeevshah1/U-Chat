import mongoose from "mongoose";
import config from "config";
import logger from "./logger";
const connect = async () => {
  const mongoUrl = config.get<string>("mongoUrl");
  try {
    await mongoose.connect(mongoUrl);
    logger.info(`Connected to Database : ${mongoUrl.split("/")[3]}`);
  } catch (error) {
    logger.error(`Error Connecting to Database : ${error}`);
    process.exit(1);
  }
};
export default connect;
