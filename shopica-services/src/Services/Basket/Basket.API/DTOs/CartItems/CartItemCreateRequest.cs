namespace Basket.API.DTOs.CartItems
{
    public class CartItemCreateRequest
    {
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public int SizeId { get; set; }
        public int ColorId { get; set; }
        public string ColorName { get; set; }
        public string SizeName { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPromotionLine { get; set; }
        public string PromotionCode { get; set; } = string.Empty;
    }
}
