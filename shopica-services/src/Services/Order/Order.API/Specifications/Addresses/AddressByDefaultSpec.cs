using Ardalis.Specification;
using Ordering.API.Models;

namespace Ordering.API.Specifications.Addresses
{
    public class AddressByDefaultSpec : Specification<Address>
    {
        public AddressByDefaultSpec(int customerId)
        {
            Query.Where(a => a.CustomerId == customerId && a.Default);
        }
    }
}
