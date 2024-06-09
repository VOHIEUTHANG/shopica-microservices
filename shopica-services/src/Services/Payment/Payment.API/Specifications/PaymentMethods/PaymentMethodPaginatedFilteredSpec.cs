using Ardalis.Specification;
using Payment.API.DTOs;
using Payment.API.Models;

namespace Payment.API.Specifications.PaymentMethods
{
    public class PaymentMethodPaginatedFilteredSpec : Specification<PaymentMethod>
    {
        public PaymentMethodPaginatedFilteredSpec(BaseParam param, string? name)
        {
            if (param.SortField == "id" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.Id);
            }

            if (!string.IsNullOrEmpty(name))
            {
                Query.Search(d => d.Name, "%" + name + "%");
            }

            Query.Skip(param.PageSize * (param.PageIndex - 1))
             .Take(param.PageSize)
             .AsNoTracking();
        }
    }
}
