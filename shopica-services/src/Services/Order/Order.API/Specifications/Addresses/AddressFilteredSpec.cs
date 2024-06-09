using Ardalis.Specification;
using Ordering.API.Models;

namespace Ordering.API.Specifications.Addresses
{
    public class AddressFilteredSpec : Specification<Address>
    {
        public AddressFilteredSpec(int customerId)
        {
            if (customerId != 0)
            {
                Query.Where(o => o.CustomerId == customerId);
            }

            Query.AsNoTracking();
        }
    }
}
