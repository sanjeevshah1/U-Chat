import Redis from "ioredis";
import dotenv from "dotenv";

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
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redis;
