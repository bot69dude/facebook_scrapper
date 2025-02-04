import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("connect", () => console.log("Connected to Upstash Redis"));
redisClient.on("error", (err) => console.error("Upstash Redis error:", err));

export default redisClient;