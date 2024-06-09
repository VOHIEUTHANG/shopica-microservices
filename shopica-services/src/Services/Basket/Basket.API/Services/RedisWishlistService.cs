using AutoMapper;
using Basket.API.DTOs;
using Basket.API.DTOs.Wishlists;
using Basket.API.Infrastructure;
using Basket.API.Interfaces;
using Basket.API.Models;

namespace Basket.API.Services
{
    public class RedisWishlistService : IWishlistService
    {
        private readonly IRedisRepository<IList<Wishlist>> _redisRepository;
        private readonly ILogger<RedisWishlistService> _logger;
        private readonly IMapper _mapper;
        private static string WishlistKeyPrefix = "/wishlist/";
        private static string GetWishlistKey(int userId) => WishlistKeyPrefix + userId.ToString();
        public RedisWishlistService(IRedisRepository<IList<Wishlist>> redisRepository,
            ILogger<RedisWishlistService> logger,
            IMapper mapper)
        {
            _redisRepository = redisRepository;
            _logger = logger;
            _mapper = mapper;
        }
        public async Task<WishlistResponse> AddAsync(WishlistCreateRequest request)
        {
            var newWishlist = _mapper.Map<Wishlist>(request);

            var wishlistCached = await _redisRepository.GetByIdAsync(GetWishlistKey(request.CustomerId));

            if (wishlistCached is null)
            {
                var wishlist = new List<Wishlist>() { newWishlist };

                await _redisRepository.SetAsync(GetWishlistKey(request.CustomerId), wishlist);

                return _mapper.Map<WishlistResponse>(newWishlist);
            }
            else
            {
                var index = wishlistCached.ToList().FindIndex(ci => ci.ProductId == request.ProductId);

                if (index == -1)
                {
                    wishlistCached.Add(newWishlist);

                    await _redisRepository.SetAsync(GetWishlistKey(request.CustomerId), wishlistCached);
                }
                else
                {
                    throw new ArgumentException("Product id is already exist!");
                }
            }
            return _mapper.Map<WishlistResponse>(newWishlist);
        }

        public async Task<bool> DeleteAsync(int customerId, int productId)
        {
            var wishlistCached = await _redisRepository.GetByIdAsync(GetWishlistKey(customerId));

            if (wishlistCached is null)
            {
                throw new ArgumentException("Product id is not exist!");
            }
            else
            {
                var index = wishlistCached.ToList().FindIndex(ci => ci.ProductId == productId);

                if (index == -1)
                {
                    throw new ArgumentException("Product id is not exist!");
                }
                else
                {
                    wishlistCached.RemoveAt(index);

                    await _redisRepository.SetAsync(GetWishlistKey(customerId), wishlistCached);
                }
            }

            return true;
        }


        public async Task<PaginatedResult<WishlistResponse>> GetAllAsync(BaseParam param, int customerId)
        {
            var wishlistCached = await _redisRepository.GetByIdAsync(GetWishlistKey(customerId));

            if (wishlistCached is null)
            {
                throw new ArgumentException("Wishlist is not exist!");
            }
            else
            {
                var result = wishlistCached.Skip(param.PageSize * (param.PageIndex - 1))
                    .Take(param.PageSize);

                var wishlistsResponse = _mapper.Map<IEnumerable<WishlistResponse>>(result);

                return new PaginatedResult<WishlistResponse>(param.PageIndex, param.PageSize, wishlistCached.Count, wishlistsResponse);
            }
        }
    }
}
