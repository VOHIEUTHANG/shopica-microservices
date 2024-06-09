using Basket.API.DTOs;
using Basket.API.DTOs.Wishlists;

namespace Basket.API.Interfaces
{
    public interface IWishlistService
    {
        public Task<PaginatedResult<WishlistResponse>> GetAllAsync(BaseParam param, int customerId);
        public Task<WishlistResponse> AddAsync(WishlistCreateRequest request);
        public Task<bool> DeleteAsync(int customerId, int productId);
    }
}
