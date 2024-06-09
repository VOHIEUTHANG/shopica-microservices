using Ardalis.Specification;
using Ordering.API.DTOs;
using Ordering.API.Models;

namespace Ordering.API.Specifications.Addresses
{
    public class AddressPaginatedFilteredSpec : Specification<Address>
    {
        public AddressPaginatedFilteredSpec(BaseParam param, int customerId)
        {
            if (param.SortField == "id" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.Id);
            }

            if (customerId != 0)
            {
                Query.Where(o => o.CustomerId == customerId);
            }

            Query.Skip(param.PageSize * (param.PageIndex - 1))
             .Take(param.PageSize)
             .AsNoTracking();
        }
    }
}
