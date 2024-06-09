using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Categories
{
    public class CategoryByNameSpec : Specification<Category>, ISingleResultSpecification<Category>
    {
        public CategoryByNameSpec(string categoryName)
        {
            Query.Where(r => r.CategoryName == categoryName);
        }
    }
}
