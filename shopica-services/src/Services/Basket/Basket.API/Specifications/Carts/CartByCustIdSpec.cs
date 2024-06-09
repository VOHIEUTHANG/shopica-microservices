using Ardalis.Specification;
using Basket.API.Models;

namespace Basket.API.Specifications.Carts
{
    public class CartByCustIdSpec : Specification<Cart>, ISingleResultSpecification<Cart>
    {
        public CartByCustIdSpec(int customerId)
        {
            Query.Where(c => c.CustomerId == customerId)
                .Include(c => c.CartItems);
        }
    }
}
