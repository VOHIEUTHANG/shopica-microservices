using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace Basket.API.Infrastructure
{
    public class RedisRepository<T> : IRedisRepository<T>
    {
        private readonly IDistributedCache _cache;
        private readonly ILogger<RedisRepository<T>> _logger;

        public RedisRepository(ILogger<RedisRepository<T>> logger, IDistributedCache cache)
        {
            _logger = logger;
            _cache = cache;
        }
        public async Task<T> GetByIdAsync(string key)
        {
            var cartCachedStr = await _cache.GetAsync(key);

            if (cartCachedStr is null || cartCachedStr.Length == 0)
            {
                return default;
            }

            return JsonSerializer.Deserialize<T>(cartCachedStr);
        }

        public async Task<T> SetAsync(string key, T data)
        {
            var json = JsonSerializer.SerializeToUtf8Bytes(data);

            await _cache.SetAsync(key, json);

            _logger.LogInformation("Basket item persisted successfully.");

            return await GetByIdAsync(key);
        }
    }
}
