using Ordering.API.DTOs.OrderDetails;
using Ordering.API.Models.Enums;

namespace Ordering.API.DTOs.Orders
{
    public class OrderResponse
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public int ProvinceId { get; set; }
        public string ProvinceName { get; set; }
        public int DistrictId { get; set; }
        public string DistrictName { get; set; }
        public string WardCode { get; set; }
        public string WardName { get; set; }
        public string Street { get; set; }
        public string FullAddress { get; set; }
        public OrderStatus Status { get; set; }
        public decimal TotalPrice { get; set; }
        public string Notes { get; set; }
        public string PromotionCode { get; set; }
        public decimal Discount { get; set; }
        public decimal ShippingCost { get; set; }
        public int PaymentId { get; set; }
        public DateTime CreatedAt { get; set; }
        public IEnumerable<OrderDetailResponse> OrderDetails { get; set; }
    }
}
