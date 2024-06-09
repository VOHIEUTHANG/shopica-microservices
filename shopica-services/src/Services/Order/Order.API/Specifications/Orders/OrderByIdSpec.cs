using Ardalis.Specification;
using Ordering.API.Models;

namespace Ordering.API.Specifications.Orders
{
    public class OrderByIdSpec : Specification<Order>, ISingleResultSpecification<Order>
    {
        public OrderByIdSpec(int orderId)
        {
            Query.Include(o => o.OrderDetails)
                .Where(b => b.Id == orderId);
        }
    }
}
