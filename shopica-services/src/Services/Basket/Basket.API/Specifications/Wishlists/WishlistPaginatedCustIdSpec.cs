using Ardalis.Specification;
using Basket.API.DTOs;
using Basket.API.Models;

namespace Basket.API.Specifications.Wishlists
{
    public class WishlistPaginatedByCustIdSpec : Specification<Wishlist>
    {
        public WishlistPaginatedByCustIdSpec(BaseParam param, int customerId)
        {
            Query.Where(w => w.CustomerId == customerId)
             .Skip(param.PageSize * (param.PageIndex - 1))
            .Take(param.PageSize)
            .AsNoTracking();
        }
    }
}
