using Ardalis.Specification;
using Ordering.API.Models;

namespace Ordering.API.Specifications.Addresses
{
    public class AddressByCustIdSpec : Specification<Address>
    {
        public AddressByCustIdSpec(int customerId)
        {
            Query.Where(a => a.CustomerId == customerId)
                .AsNoTracking();
        }
    }
}
