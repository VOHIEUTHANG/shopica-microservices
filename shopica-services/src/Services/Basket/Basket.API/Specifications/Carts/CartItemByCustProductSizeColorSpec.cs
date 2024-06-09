using Ardalis.Specification;
using Basket.API.Models;

namespace Basket.API.Specifications.Carts
{
    public class CartItemByCustProductSizeColorSpec : Specification<CartItem>, ISingleResultSpecification<CartItem>
    {
        public CartItemByCustProductSizeColorSpec(int customerId, int productId, int sizeId, int colorId)
        {
            Query.Where(ci => ci.Cart.CustomerId == customerId
                                && ci.ProductId == productId
                                && ci.SizeId == sizeId
                                && ci.ColorId == colorId);
        }
    }
}
