using Ardalis.Specification;
using Payment.API.DTOs;

namespace Payment.API.Specifications.Payments
{
    public class PaymentPaginatedFilteredSpec : Specification<Models.Payment>
    {
        public PaymentPaginatedFilteredSpec(BaseParam param)
        {
            if (param.SortField == "id" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.Id);
            }

            //if (customerId != 0)
            //{
            //    Query.Where(o => o.CustomerId == customerId);
            //}

            //if (!string.IsNullOrEmpty(status))
            //{
            //    Query.Search(d => d.Status.ToString(), "%" + status + "%");
            //}

            Query.Include(o => o.Transactions)
                .Include(o => o.PaymentMethod)
                .Skip(param.PageSize * (param.PageIndex - 1))
                 .Take(param.PageSize)
                 .AsNoTracking();
        }
    }
}
