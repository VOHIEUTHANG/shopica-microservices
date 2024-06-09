using Basket.API.DTOs.CartItems;
using Basket.API.DTOs.PromotionResults;

namespace Basket.API.DTOs.Carts
{
    public class CartResponse
    {
        public int CustomerId { get; set; }
        public Decimal TotalPrice { get; set; }
        public IEnumerable<CartItemResponse> CartItems { get; set; }
        public IEnumerable<PromotionResultResponse> PromotionResults { get; set; } = new List<PromotionResultResponse>();
    }
}
