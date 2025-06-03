export const getCache = async (redisClient, cacheKey) => {
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("🔄 Serving cached data for key:", cacheKey);
      return JSON.parse(cachedData); // Return parsed cached data
    }
    return null; // Cache miss
  } catch (error) {
    console.error("❌ Error fetching from Redis:", error.message);
    return null;
  }
};

export const setCache = async (redisClient, cacheKey, data, expiry = 300) => {
  try {
    await redisClient.set(cacheKey, JSON.stringify(data), { EX: expiry }); // Set cache with expiration
    console.log("⚡ Cached data for key:", cacheKey, "with expiry:", expiry, "seconds");
  } catch (error) {
    console.error("❌ Error setting cache in Redis:", error.message);
  }
};

export const invalidateCache = async (redisClient, cacheKey) => {
  try {
    await redisClient.del(cacheKey); // Invalidate the cache
    console.log("🗑️ Cache invalidated for key:", cacheKey);
  } catch (error) {
    console.error("❌ Error invalidating cache in Redis:", error.message);
  }
};