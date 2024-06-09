using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Sizes
{
    public class SizeByIdSpec : Specification<Size>, ISingleResultSpecification<Size>
    {
        public SizeByIdSpec(int sizeId)
        {
            Query.Where(c => c.Id == sizeId);
        }
    }
}
