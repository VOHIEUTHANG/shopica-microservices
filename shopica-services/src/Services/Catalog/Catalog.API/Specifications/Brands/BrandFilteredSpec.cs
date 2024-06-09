using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Brands
{
    public class BrandFilteredSpec : Specification<Brand>
    {
        public BrandFilteredSpec(string? brandName)
        {
            if (!string.IsNullOrEmpty(brandName))
            {
                Query.Search(d => d.BrandName, "%" + brandName + "%");
            }

            Query.AsNoTracking();
        }
    }
}
