using Basket.API.DTOs.CartItems;
using Basket.API.DTOs.Carts;

namespace Basket.API.Interfaces
{
    public interface ICartService
    {
        public Task<CartResponse> GetByIdAsync(int customerId);
        public Task<CartResponse> AddToCartAsync(CartItemCreateRequest request);
        public Task<CartResponse> UpdateCartAsync(CartItemUpdateRequest request);
        public Task<bool> RemoveCartItemAsync(int customerId, int productId, int sizeId, int colorId);
        public Task<bool> EmptyCartAsync(int customerId);
        public Task<bool> RemoveCartItemByPromotionAsync(int customerId, string promotionCode);
    }
}
