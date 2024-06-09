using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Categories
{
    public class CategoryByIdSpec : Specification<Category>, ISingleResultSpecification<Category>
    {
        public CategoryByIdSpec(int categoryId)
        {
            Query.Where(r => r.Id == categoryId);
        }
    }
}
