using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Colors
{
    public class ColorFilteredSpec : Specification<Color>
    {
        public ColorFilteredSpec(string? colorname)
        {
            if (!string.IsNullOrEmpty(colorname))
            {
                Query.Search(d => d.ColorName, "%" + colorname + "%");
            }

            Query.AsNoTracking();
        }
    }
}
