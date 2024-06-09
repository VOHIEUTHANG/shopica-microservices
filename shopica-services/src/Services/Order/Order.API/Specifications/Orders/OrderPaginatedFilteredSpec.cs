using Ardalis.Specification;
using Ordering.API.DTOs;
using Ordering.API.Models;
using Ordering.API.Models.Enums;

namespace Ordering.API.Specifications.Orders
{
    public class OrderPaginatedFilteredSpec : Specification<Order>
    {
        public OrderPaginatedFilteredSpec(BaseParam param, int customerId, string? customerName, string? status)
        {
            if (param.SortField == "id" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.Id);
            }

            if (customerId != 0)
            {
                Query.Where(o => o.CustomerId == customerId);
            }

            if (!string.IsNullOrEmpty(customerName))
            {
                Query.Search(d => d.CustomerName, "%" + customerName + "%");
            }


            if (!string.IsNullOrEmpty(status))
            {
                var statusList = status.ToLower().Split(',').Select(s => (OrderStatus)Enum.Parse(typeof(OrderStatus), s));
                Query.Where(d => statusList.Contains(d.Status));
            }

            Query.Include(o => o.OrderDetails)
                .Skip(param.PageSize * (param.PageIndex - 1))
             .Take(param.PageSize)
             .AsNoTracking();
        }
    }
}
