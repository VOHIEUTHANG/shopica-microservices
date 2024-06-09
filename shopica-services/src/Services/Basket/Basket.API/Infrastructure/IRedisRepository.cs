namespace Basket.API.Infrastructure
{
    public interface IRedisRepository<T>
    {
        public Task<T> GetByIdAsync(string key);
        public Task<T> SetAsync(string key, T data);
    }
}
