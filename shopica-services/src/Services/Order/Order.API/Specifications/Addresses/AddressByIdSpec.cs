using Ardalis.Specification;
using Ordering.API.Models;

namespace Ordering.API.Specifications.Addresses
{
    public class AddressByIdSpec : Specification<Address>, ISingleResultSpecification<Address>
    {
        public AddressByIdSpec(int addressId)
        {
            Query.Where(a => a.Id == addressId);
        }
    }
}
