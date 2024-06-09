using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Colors
{
    public class ColorByCodeSpec : Specification<Color>, ISingleResultSpecification<Color>
    {
        public ColorByCodeSpec(string colorCode)
        {
            Query.Where(c => c.ColorCode == colorCode);
        }
    }
}
