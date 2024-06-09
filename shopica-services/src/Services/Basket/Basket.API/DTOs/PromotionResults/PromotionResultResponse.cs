using Basket.API.Models.Enums;

namespace Basket.API.DTOs.PromotionResults
{
    public class PromotionResultResponse
    {
        public int Id { get; set; }
        public string PromotionCode { get; set; }
        public PromotionType PromotionType { get; set; }
        public int SalesById { get; set; }
        public string SalesByName { get; set; }
        public int SalesByQuantity { get; set; }
        public int PromotionById { get; set; }
        public string PromotionByName { get; set; }
        public string PromotionSizeName { get; set; }
        public int PromotionSizeId { get; set; }
        public string PromotionColorName { get; set; }
        public int PromotionColorId { get; set; }
        public string PromotionImageUrl { get; set; }
        public decimal PromotionPrice { get; set; }
        public decimal SalesByAmount { get; set; }
        public int PromotionQuantity { get; set; }
        public decimal PromotionAmount { get; set; }
        public decimal PromotionDiscount { get; set; }
        public decimal PromotionDiscountLimit { get; set; }
        public int OrderId { get; set; }
        public int CartId { get; set; }
        public int CustomerId { get; set; }
    }
}
