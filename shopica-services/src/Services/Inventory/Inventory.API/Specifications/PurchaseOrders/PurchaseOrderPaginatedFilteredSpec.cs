using Ardalis.Specification;
using Inventory.API.Models.Enums;

namespace Inventory.API.Specifications.PurchaseOrders
{
    public class PurchaseOrderPaginatedFilteredSpec : Specification<PurchaseOrder>
    {
        public PurchaseOrderPaginatedFilteredSpec(BaseParam param, string? status)
        {
            if (param.SortField == "id" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.Id);
            }


            if (!string.IsNullOrEmpty(status))
            {
                var statusList = status.ToLower().Split(',').Select(s => (OrderStatus)Enum.Parse(typeof(OrderStatus), s));
                Query.Where(d => statusList.Contains(d.Status));
            }

            Query.Include(o => o.PurchaseOrderDetails)
                .Skip(param.PageSize * (param.PageIndex - 1))
             .Take(param.PageSize)
             .AsNoTracking();
        }
    }
}
