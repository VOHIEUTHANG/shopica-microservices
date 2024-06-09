using AutoMapper;
using Basket.API.DTOs.CartItems;
using Basket.API.DTOs.Carts;
using Basket.API.DTOs.PromotionResults;
using Basket.API.Infrastructure;
using Basket.API.Interfaces;
using Basket.API.Models;
using Basket.API.Specifications.Carts;
using Basket.API.Specifications.PromotionResults;

namespace Basket.API.Services
{
    public class CartService : ICartService
    {
        private readonly ILogger<CartService> _logger;
        private readonly IBasketRepository<Cart> _cartRepository;
        private readonly IBasketRepository<CartItem> _cartItemRepository;
        private readonly IBasketRepository<PromotionResult> _promotionResultRepository;
        private readonly IMapper _mapper;
        public CartService(
           IBasketRepository<Cart> cartRepository,
           IBasketRepository<CartItem> cartItemRepository,
           IBasketRepository<PromotionResult> promotionResultRepository,
           ILogger<CartService> logger,
        IMapper mapper)
        {
            _cartRepository = cartRepository;
            _cartItemRepository = cartItemRepository;
            _promotionResultRepository = promotionResultRepository;
            _mapper = mapper;
            _logger = logger;
        }
        public async Task<CartResponse> AddToCartAsync(CartItemCreateRequest request)
        {
            var cart = await _cartRepository.FirstOrDefaultAsync(new CartByCustIdSpec(request.CustomerId));
            if (cart is null)
            {
                var newCart = new Cart()
                {
                    CustomerId = request.CustomerId,
                    CartItems = new List<CartItem>()
                    {
                        _mapper.Map<CartItem>(request)
                    }
                };
                await _cartRepository.AddAsync(newCart);
                return _mapper.Map<CartResponse>(newCart);
            }
            else
            {
                var spec = new CartItemByCustProductSizeColorSpec(cart.CustomerId, request.ProductId, request.SizeId, request.ColorId);
                var cartItem = await _cartItemRepository.FirstOrDefaultAsync(spec);
                if (cartItem is null)
                {
                    var newCartItem = _mapper.Map<CartItem>(request);
                    await _cartItemRepository.AddAsync(newCartItem);
                    await _cartItemRepository.SaveChangesAsync();
                }
                else
                {
                    cartItem.Quantity += request.Quantity;
                    cartItem.UnitPrice = request.UnitPrice;
                    cartItem.ProductName = request.ProductName;
                    cartItem.SizeName = request.SizeName;
                    cartItem.ColorName = request.ColorName;
                    cartItem.ImageUrl = request.ImageUrl;
                    await _cartItemRepository.UpdateAsync(cartItem);
                    await _cartItemRepository.SaveChangesAsync();
                }
            }
            return _mapper.Map<CartResponse>(cart);
        }

        public async Task<bool> EmptyCartAsync(int customerId)
        {
            var cart = await _cartRepository.FirstOrDefaultAsync(new CartByCustIdSpec(customerId));
            if (cart is not null)
            {
                cart.CartItems = new List<CartItem>();
                await _cartRepository.UpdateAsync(cart);
                await _cartRepository.SaveChangesAsync();
            }

            return true;
        }

        public async Task<CartResponse> GetByIdAsync(int customerId)
        {
            var cart = await _cartRepository.FirstOrDefaultAsync(new CartByCustIdSpec(customerId));
            if (cart is null)
            {
                var newCart = new Cart()
                {
                    CustomerId = customerId
                };
                await _cartRepository.AddAsync(newCart);
                await _cartRepository.SaveChangesAsync();
                cart = newCart;
            };

            var promotionResults = await _promotionResultRepository.ListAsync(new PromotionResultByCustIdSpec(cart.CustomerId));
            var result = _mapper.Map<CartResponse>(cart);

            result.PromotionResults = _mapper.Map<List<PromotionResultResponse>>(promotionResults);

            _logger.LogInformation("Get Cart By Id {CustomerId}", customerId);
            return result;
        }

        public async Task<bool> RemoveCartItemAsync(int customerId, int productId, int sizeId, int colorId)
        {
            var spec = new CartItemByCustProductSizeColorSpec(customerId, productId, sizeId, colorId);
            var cartItem = await _cartItemRepository.FirstOrDefaultAsync(spec);
            if (cartItem is null) throw new ArgumentException($"Can not find cart item with key: {customerId}, {productId}, {sizeId}, {colorId}");

            await _cartItemRepository.DeleteAsync(cartItem);
            await _cartItemRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveCartItemByPromotionAsync(int customerId, string promotionCode)
        {
            var cartItems = await _cartItemRepository.ListAsync(new CartItemByCustPromotionSpec(customerId, promotionCode));

            await _cartItemRepository.DeleteRangeAsync(cartItems);

            return true;
        }

        public async Task<CartResponse> UpdateCartAsync(CartItemUpdateRequest request)
        {
            var spec = new CartItemByCustProductSizeColorSpec(request.CustomerId, request.ProductId, request.SizeId, request.ColorId);
            var cartItem = await _cartItemRepository.FirstOrDefaultAsync(spec);
            if (cartItem is null) throw new ArgumentException($"Can not find cart item with key: {request.CustomerId}, {request.ProductId}, {request.SizeId}, {request.ColorId}");

            cartItem.SizeId = request.SizeId;
            cartItem.ColorId = request.ColorId;
            cartItem.Quantity = request.Quantity;
            cartItem.UnitPrice = request.UnitPrice;
            cartItem.ProductName = request.ProductName;
            cartItem.SizeName = request.SizeName;
            cartItem.ColorName = request.ColorName;
            cartItem.ImageUrl = request.ImageUrl;

            await _cartItemRepository.UpdateAsync(cartItem);
            await _cartItemRepository.SaveChangesAsync();

            var cart = await _cartRepository.FirstOrDefaultAsync(new CartByCustIdSpec(request.CustomerId));

            return _mapper.Map<CartResponse>(cart);
        }
    }
}
