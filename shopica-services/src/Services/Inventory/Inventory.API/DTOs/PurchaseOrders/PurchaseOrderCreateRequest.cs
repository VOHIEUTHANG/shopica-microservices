using Inventory.API.Models.Enums;

namespace Inventory.API.DTOs.PurchaseOrders
{
    public class PurchaseOrderCreateRequest
    {
        public decimal TotalPrice { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public IEnumerable<PurchaseOrderDetailCreateRequest> PurchaseOrderDetails { get; set; }
    }
}
