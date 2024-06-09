using AutoMapper;
using Basket.API.DTOs;
using Basket.API.DTOs.Wishlists;
using Basket.API.Infrastructure;
using Basket.API.Interfaces;
using Basket.API.Models;
using Basket.API.Specifications.Wishlists;

namespace Basket.API.Services
{
    public class WishlistService : IWishlistService
    {
        private readonly IBasketRepository<Wishlist> _wishlistRepository;
        private readonly IMapper _mapper;
        public WishlistService(
           IBasketRepository<Wishlist> wishlistRepository,
            IMapper mapper)
        {
            _wishlistRepository = wishlistRepository;
            _mapper = mapper;
        }
        public async Task<WishlistResponse> AddAsync(WishlistCreateRequest request)
        {
            var wishlistExists = await _wishlistRepository.FirstOrDefaultAsync(new WishlistByCustIdProductIdSpec(request.CustomerId, request.ProductId));
            if (wishlistExists is not null) throw new ArgumentException("Product id is already exist!");

            var wishlist = _mapper.Map<Wishlist>(request);

            await _wishlistRepository.AddAsync(wishlist);
            await _wishlistRepository.SaveChangesAsync();
            return _mapper.Map<WishlistResponse>(wishlist);
        }

        public async Task<bool> DeleteAsync(int customerId, int productId)
        {
            var wishlistExists = await _wishlistRepository.FirstOrDefaultAsync(new WishlistByCustIdProductIdSpec(customerId, productId));
            if (wishlistExists is null) throw new ArgumentException("Product id is not already exist!");

            await _wishlistRepository.DeleteAsync(wishlistExists);
            await _wishlistRepository.SaveChangesAsync();
            return true;
        }

        public async Task<PaginatedResult<WishlistResponse>> GetAllAsync(BaseParam param, int customerId)
        {
            var wishlists = await _wishlistRepository.ListAsync(new WishlistPaginatedByCustIdSpec(param, customerId));
            var totalRecords = await _wishlistRepository.CountAsync(new WishlistByCustIdSpec(customerId));
            var wishlistsResponse = _mapper.Map<IEnumerable<WishlistResponse>>(wishlists);
            return new PaginatedResult<WishlistResponse>(param.PageIndex, param.PageSize, totalRecords, wishlistsResponse);
        }
    }
}
