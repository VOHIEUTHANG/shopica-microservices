using Basket.API.Models.Enums;

namespace Basket.API.DTOs.Promotions
{
    public class PromotionCreateRequest
    {
        public string Code { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public PromotionType Type { get; set; }
        public int SalesById { get; set; }
        public string SalesByName { get; set; }
        public int SalesByQuantity { get; set; }
        public int PromotionById { get; set; }
        public string PromotionSizeName { get; set; }
        public int PromotionSizeId { get; set; }
        public string PromotionColorName { get; set; }
        public int PromotionColorId { get; set; }
        public string PromotionImageUrl { get; set; }
        public decimal PromotionPrice { get; set; }
        public decimal SalesByAmount { get; set; }
        public string PromotionByName { get; set; }
        public int PromotionQuantity { get; set; }
        public decimal PromotionAmount { get; set; }
        public decimal PromotionDiscount { get; set; }
        public decimal PromotionDiscountLimit { get; set; }
        public bool Active { get; set; }
    }
}
