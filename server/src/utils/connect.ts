import mongoose from "mongoose";
import logger from "./logger";
const connect = async () => {
  const mongoUrl = process.env.MONGO_URL!;
  try {
    await mongoose.connect(mongoUrl);
    logger.info(`Connected to Database : ${mongoUrl.split("appName=")[1]}`);
  } catch (error) {
    logger.error(`Error Connecting to Database : ${error}`);
    process.exit(1);
  }
};
export default connect;
