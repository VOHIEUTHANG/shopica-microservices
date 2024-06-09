using AutoMapper;
using Basket.API.DTOs.CartItems;
using Basket.API.DTOs.Carts;
using Basket.API.DTOs.PromotionResults;
using Basket.API.Infrastructure;
using Basket.API.Interfaces;
using Basket.API.Models;
using Basket.API.Specifications.PromotionResults;

namespace Basket.API.Services
{
    public class RedisCartService : ICartService
    {
        private readonly IRedisRepository<Cart> _redisRepository;
        private readonly IBasketRepository<PromotionResult> _promotionResultRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<RedisCartService> _logger;

        private static string BasketKeyPrefix = "/basket/";
        private static string GetBasketKey(int userId) => BasketKeyPrefix + userId.ToString();
        public RedisCartService(
            IRedisRepository<Cart> redisRepository,
            IBasketRepository<PromotionResult> promotionResultRepository,
            ILogger<RedisCartService> logger,
            IMapper mapper)
        {
            _redisRepository = redisRepository;
            _promotionResultRepository = promotionResultRepository;
            _mapper = mapper;
            _logger = logger;
        }
        public async Task<CartResponse> AddToCartAsync(CartItemCreateRequest request)
        {
            var cartCached = await _redisRepository.GetByIdAsync(GetBasketKey(request.CustomerId));

            if (cartCached is null)
            {
                var newCart = new Cart()
                {
                    CustomerId = request.CustomerId,
                    CartItems = new List<CartItem>() { _mapper.Map<CartItem>(request) },
                    CreatedAt = DateTime.UtcNow,
                };

                await _redisRepository.SetAsync(GetBasketKey(request.CustomerId), newCart);

                return _mapper.Map<CartResponse>(newCart);
            }
            else
            {
                var index = cartCached.CartItems.ToList().FindIndex(ci => ci.ProductId == request.ProductId
                                            && ci.SizeId == request.SizeId
                                            && ci.ColorId == request.ColorId);

                if (index == -1)
                {
                    cartCached.CartItems.Add(_mapper.Map<CartItem>(request));
                }
                else
                {
                    cartCached.CartItems[index].Quantity += request.Quantity;
                    cartCached.CartItems[index].UnitPrice = request.UnitPrice;
                    cartCached.CartItems[index].ProductName = request.ProductName;
                    cartCached.CartItems[index].SizeName = request.SizeName;
                    cartCached.CartItems[index].ColorName = request.ColorName;
                    cartCached.CartItems[index].ImageUrl = request.ImageUrl;
                }

                await _redisRepository.SetAsync(GetBasketKey(request.CustomerId), cartCached);

                return _mapper.Map<CartResponse>(cartCached);
            }
        }

        public async Task<bool> EmptyCartAsync(int customerId)
        {
            var cartEmpty = GetEmptyCart(customerId);

            await _redisRepository.SetAsync(GetBasketKey(customerId), cartEmpty);

            return true;
        }

        public async Task<CartResponse> GetByIdAsync(int customerId)
        {
            var cartCached = await _redisRepository.GetByIdAsync(GetBasketKey(customerId));

            if (cartCached is null)
            {
                var emptyCart = GetEmptyCart(customerId);

                await _redisRepository.SetAsync(GetBasketKey(customerId), emptyCart);

                cartCached = emptyCart;
            }

            var promotionResults = await _promotionResultRepository.ListAsync(new PromotionResultByCustIdSpec(cartCached.CustomerId));

            var result = _mapper.Map<CartResponse>(cartCached);

            result.PromotionResults = _mapper.Map<List<PromotionResultResponse>>(promotionResults);

            _logger.LogInformation("Get Cart By Id {CustomerId}", customerId);

            return result;
        }

        public async Task<bool> RemoveCartItemAsync(int customerId, int productId, int sizeId, int colorId)
        {
            var cartCached = await _redisRepository.GetByIdAsync(GetBasketKey(customerId));

            if (cartCached is null)
            {
                throw new ArgumentException($"Can not find cart with key: {customerId}");
            }

            var index = cartCached.CartItems.ToList().FindIndex(ci => ci.ProductId == productId
                                        && ci.SizeId == sizeId
                                        && ci.ColorId == colorId);

            if (index == -1)
            {
                throw new ArgumentException($"Can not find cart item with key: {customerId}, {productId}, {sizeId}, {colorId}");
            }
            else
            {
                cartCached.CartItems.RemoveAt(index);
            }


            await _redisRepository.SetAsync(GetBasketKey(customerId), cartCached);

            return true;

        }

        public async Task<CartResponse> UpdateCartAsync(CartItemUpdateRequest request)
        {
            var cartCached = await _redisRepository.GetByIdAsync(GetBasketKey(request.CustomerId));

            if (cartCached is null)
            {
                throw new ArgumentException($"Can not find cart with key: {request.CustomerId}");
            }

            var index = cartCached.CartItems.ToList().FindIndex(ci => ci.ProductId == request.ProductId
                                        && ci.SizeId == request.OldSizeId
                                        && ci.ColorId == request.OldColorId);

            if (index == -1)
            {
                throw new ArgumentException($"Can not find cart item with key: {request.CustomerId},{request.ProductId}, {request.OldSizeId}, {request.OldColorId}");
            }
            else
            {
                cartCached.UpdatedAt = DateTime.UtcNow;

                cartCached.CartItems[index].SizeId = request.SizeId;
                cartCached.CartItems[index].ColorId = request.ColorId;
                cartCached.CartItems[index].Quantity = request.Quantity;
                cartCached.CartItems[index].UnitPrice = request.UnitPrice;
                cartCached.CartItems[index].ProductName = request.ProductName;
                cartCached.CartItems[index].SizeName = request.SizeName;
                cartCached.CartItems[index].ColorName = request.ColorName;
                cartCached.CartItems[index].ImageUrl = request.ImageUrl;
            }

            await _redisRepository.SetAsync(GetBasketKey(request.CustomerId), cartCached);

            var promotionResults = await _promotionResultRepository.ListAsync(new PromotionResultByCustIdSpec(cartCached.CustomerId));

            var result = _mapper.Map<CartResponse>(cartCached);

            result.PromotionResults = _mapper.Map<List<PromotionResultResponse>>(promotionResults);

            return result;

        }

        private Cart GetEmptyCart(int customerId)
        {
            return new Cart()
            {
                CustomerId = customerId,
                CreatedAt = DateTime.UtcNow,
                CartItems = new List<CartItem>()
            };
        }

        public async Task<bool> RemoveCartItemByPromotionAsync(int customerId, string promotionCode)
        {
            var cartCached = await _redisRepository.GetByIdAsync(GetBasketKey(customerId));

            if (cartCached is null)
            {
                throw new ArgumentException($"Can not find cart with key: {customerId}");
            }

            if (string.IsNullOrEmpty(promotionCode))
            {
                cartCached.CartItems = cartCached.CartItems.Where(ci => !ci.IsPromotionLine).ToList();
            }
            else
            {
                cartCached.CartItems = cartCached.CartItems.Where(ci => (ci.PromotionCode != promotionCode && !ci.IsPromotionLine)).ToList();
            }

            await _redisRepository.SetAsync(GetBasketKey(customerId), cartCached);

            return true;
        }
    }
}
