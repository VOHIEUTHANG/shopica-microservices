using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Categories
{
    public class CategoryFilteredSpec : Specification<Category>
    {
        public CategoryFilteredSpec(string? name)
        {
            if (!string.IsNullOrEmpty(name))
            {
                Query.Search(d => d.CategoryName, "%" + name + "%");
            }

            Query.AsNoTracking();
        }
    }
}
