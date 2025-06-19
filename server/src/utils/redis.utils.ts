import Redis from "ioredis";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

const host = process.env.REDIS_HOST;
const port = Number(process.env.REDIS_PORT);
const password = process.env.REDIS_PASSWORD;

if (!host || isNaN(port)) {
  throw new Error("❌ Invalid REDIS_HOST or REDIS_PORT");
}

const redis = new Redis({
  host,
  port,
  password,
});

redis.on("connect", () => {
  logger.info("✅ Connected to Redis");
});

redis.on("error", (err: unknown) => {
  if (err instanceof Error) console.error("Redis error:", err.message);
  else logger.error("Redis error:", err);
});

export default redis;
