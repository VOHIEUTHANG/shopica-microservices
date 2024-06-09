using Ardalis.Specification;

namespace Inventory.API.Specifications.PurchaseOrders
{
    public class PurchaseOrderByIdSpec : Specification<PurchaseOrder>, ISingleResultSpecification<PurchaseOrder>
    {
        public PurchaseOrderByIdSpec(int orderId)
        {
            Query.Include(o => o.PurchaseOrderDetails)
                .Where(b => b.Id == orderId);
        }
    }
}
