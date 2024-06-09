namespace Basket.API.DTOs.PromotionCalculations
{
    public class PromotionApplyRequest
    {
        public int CustomerId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string PromotionCode { get; set; }
        public IEnumerable<PromotionDetailApplyRequest> PromotionDetails { get; set; }
    }
}
