using Ardalis.Specification;
using Basket.API.Models;

namespace Basket.API.Specifications.Carts
{
    public class CartItemByCustPromotionSpec : Specification<CartItem>
    {
        public CartItemByCustPromotionSpec(int customerId, string promotionCode)
        {
            if (!string.IsNullOrEmpty(promotionCode))
            {
                Query.Where(pr => pr.PromotionCode == promotionCode);
            }

            Query.Where(pr => pr.IsPromotionLine && pr.Cart.CustomerId == customerId)
                .AsNoTracking();
        }
    }
}
