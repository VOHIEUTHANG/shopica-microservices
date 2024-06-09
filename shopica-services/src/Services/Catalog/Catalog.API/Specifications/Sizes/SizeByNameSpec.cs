using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Sizes
{
    public class SizeByNameSpec : Specification<Size>, ISingleResultSpecification<Size>
    {
        public SizeByNameSpec(string sizeName)
        {
            Query.Where(c => c.SizeName == sizeName);
        }
    }
}
