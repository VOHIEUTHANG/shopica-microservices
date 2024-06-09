using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Colors
{
    public class ColorByIdSpec : Specification<Color>, ISingleResultSpecification<Color>
    {
        public ColorByIdSpec(int colorId)
        {
            Query.Where(c => c.Id == colorId);
        }
    }
}
