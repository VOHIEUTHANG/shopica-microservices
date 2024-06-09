using Inventory.API.Models.Enums;

namespace Inventory.API.Models
{
    public class PurchaseOrder : BaseEntity
    {
        public int Id { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public IEnumerable<PurchaseOrderDetail> PurchaseOrderDetails { get; set; }
    }
}
