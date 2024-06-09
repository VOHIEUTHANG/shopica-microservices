using Ardalis.Specification;
using Inventory.API.Models.Enums;

namespace Inventory.API.Specifications.PurchaseOrders
{
    public class PurchaseOrderFilteredSpec : Specification<PurchaseOrder>
    {
        public PurchaseOrderFilteredSpec(string? status)
        {
            if (!string.IsNullOrEmpty(status))
            {
                var statusList = status.ToLower().Split(',').Select(s => (OrderStatus)Enum.Parse(typeof(OrderStatus), s));
                Query.Where(d => statusList.Contains(d.Status));
            }

            Query.AsNoTracking();
        }
    }
}
