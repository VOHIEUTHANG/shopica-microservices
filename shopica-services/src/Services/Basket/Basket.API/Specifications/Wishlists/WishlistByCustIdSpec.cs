using Ardalis.Specification;
using Basket.API.Models;

namespace Basket.API.Specifications.Wishlists
{
    public class WishlistByCustIdSpec : Specification<Wishlist>
    {
        public WishlistByCustIdSpec(int customerId)
        {
            Query.Where(w => w.CustomerId == customerId)
            .AsNoTracking();
        }
    }
}
