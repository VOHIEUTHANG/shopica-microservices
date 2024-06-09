using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Sizes
{
    public class SizeFilteredSpec : Specification<Size>
    {
        public SizeFilteredSpec(string? sizeName)
        {
            if (!string.IsNullOrEmpty(sizeName))
            {
                Query.Search(d => d.SizeName, "%" + sizeName + "%");
            }

            Query.AsNoTracking();
        }
    }
}
