// middleware/cache.js
import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Connected to Upstash Redis"));

export const cache = (ttl = 300) => async (req, res, next) => {
  try {
    const key = `cache:${req.originalUrl}`;
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // Store original json method
    const originalJson = res.json;

    // Override res.json method
    res.json = function(data) {
      // Store the data in Redis using set with EX option
      redisClient.set(key, JSON.stringify(data), 'EX', ttl);
      
      // Call original res.json with data
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    console.error("Cache middleware error:", error);
    next(error);
  }
};