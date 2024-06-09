using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Brands
{
    public class BrandByIdSpec : Specification<Brand>, ISingleResultSpecification<Brand>
    {
        public BrandByIdSpec(int brandId)
        {
            Query.Where(b => b.Id == brandId);
        }
    }
}
