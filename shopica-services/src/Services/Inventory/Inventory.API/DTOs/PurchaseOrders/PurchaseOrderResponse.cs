using Inventory.API.Models.Enums;

namespace Inventory.API.DTOs.PurchaseOrders
{
    public class PurchaseOrderResponse
    {
        public int Id { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public IEnumerable<PurchaseOrderDetailResponse> PurchaseOrderDetails { get; set; }
    }
}
