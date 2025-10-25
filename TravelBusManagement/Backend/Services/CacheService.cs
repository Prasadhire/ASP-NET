using Microsoft.Extensions.Caching.Memory;
using System;

namespace Backend.Services
{
    public class CacheService
    {
        private readonly IMemoryCache _cache;
        private readonly TimeSpan _defaultExpiration = TimeSpan.FromMinutes(10);

        public CacheService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public T GetOrSet<T>(string key, Func<T> getFunction, TimeSpan? expiration = null)
        {
            if (!_cache.TryGetValue(key, out T value))
            {
                value = getFunction();
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(expiration ?? _defaultExpiration);
                _cache.Set(key, value, cacheOptions);
            }
            return value;
        }

        public void Remove(string key)
        {
            _cache.Remove(key);
        }
    }
}
