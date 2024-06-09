using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Brands
{
    public class BrandByNameSpec : Specification<Brand>, ISingleResultSpecification<Brand>
    {
        public BrandByNameSpec(string brandName)
        {
            Query.Where(c => c.BrandName == brandName);
        }
    }
}
