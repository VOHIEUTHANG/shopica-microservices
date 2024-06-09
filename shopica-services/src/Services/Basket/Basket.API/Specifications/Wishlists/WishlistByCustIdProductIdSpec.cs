using Ardalis.Specification;
using Basket.API.Models;

namespace Basket.API.Specifications.Wishlists
{
    public class WishlistByCustIdProductIdSpec : Specification<Wishlist>
    {
        public WishlistByCustIdProductIdSpec(int customerId, int productId)
        {
            Query.Where(w => w.CustomerId == customerId && w.ProductId == productId);
        }
    }
}
