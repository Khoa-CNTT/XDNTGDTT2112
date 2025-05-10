import redis, { RedisClientType } from "redis";
import { Express } from "express";

// Đối tượng lưu trữ các client Redis
const clients: {
  default: RedisClientType | null;
  [key: string]: RedisClientType | null;
} = {
  default: null,
};

// Định nghĩa các trạng thái kết nối Redis
const STATUS_CONNECTION = {
  CONNECT: "connect",
  RECONNECTING: "reconnecting",
  READY: "ready",
  CLOSE: "close",
  END: "end",
  ERROR: "error",
  CONNECTION_ERROR: "connectionError",
};

// Hàm xử lý các sự kiện kết nối Redis
const handleEventRedisClient = (client: RedisClientType) => {
  client.on(STATUS_CONNECTION.CONNECT, () => {
    console.log("Redis client connected");
  });
  client.on(STATUS_CONNECTION.RECONNECTING, () => {
    console.log("Redis client reconnecting");
  });

  client.on(STATUS_CONNECTION.READY, () => {
    console.log("Redis client ready");
  });

  client.on(STATUS_CONNECTION.CLOSE, () => {
    console.log("Redis client close");
  });

  client.on(STATUS_CONNECTION.END, () => {
    console.log("Redis client end");
  });

  client.on(STATUS_CONNECTION.ERROR, (error) => {
    console.error("Redis client error", error);
  });

  client.on(STATUS_CONNECTION.CONNECTION_ERROR, (error) => {
    console.error("Redis client connection error", error);
  });
};

// Hàm khởi tạo client Redis mặc định
const initialRedis = async () => {
  const redisClient: RedisClientType = redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  handleEventRedisClient(redisClient);

  await redisClient.connect();

  clients.default = redisClient;
};

// Hàm lấy client Redis theo tên
const getRedisClient = (name: string = "default") => {
  if (!clients[name]) {
    throw new Error(`Redis client ${name} not initialized`);
  }
  return clients[name];
};

// Hàm kiểm tra kết nối Redis
const checkRedisConnection = async (name: string = "default") => {
  try {
    const client = getRedisClient(name);
    await client.ping();
    return true;
  } catch (error) {
    console.error(`Redis connection check failed for ${name}:`, error);
    return false;
  }
};

// Hàm đóng client Redis
const closeRedisClient = async (name: string = "default") => {
  const client = clients[name];
  if (client) {
    try {
      await client.quit();
      console.log(`Redis client ${name} closed successfully`);
    } catch (error) {
      console.error(`Error closing Redis client ${name}:`, error);
      // Nếu quit() không thành công, thử force close
      await client.disconnect();
    } finally {
      clients[name] = null;
    }
  }
};

//
const connect = async () => {
  await initialRedis();
};

const redisClient = {
  connect,
  initialRedis,
  getRedisClient,
  closeRedisClient,
  checkRedisConnection,
};

export {
  connect,
  initialRedis,
  getRedisClient,
  closeRedisClient,
  checkRedisConnection,
};

export default redisClient;
