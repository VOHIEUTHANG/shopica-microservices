using Ardalis.Specification;
using Ordering.API.Models;
using Ordering.API.Models.Enums;

namespace Ordering.API.Specifications.Orders
{
    public class OrderFilteredSpec : Specification<Order>
    {
        public OrderFilteredSpec(int customerId, string? customerName, string? status)
        {
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

            Query.AsNoTracking();
        }
    }
}
