using Ardalis.Specification;
using Catalog.API.DTOs;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Categories
{
    public class CategoryPaginatedFilteredSpec : Specification<Category>
    {
        public CategoryPaginatedFilteredSpec(BaseParam param, string? name)
        {
            if (param.SortField == "id" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.Id);
            }

            if (!string.IsNullOrEmpty(name))
            {
                Query.Search(d => d.CategoryName, "%" + name + "%");
            }

            Query.Skip(param.PageSize * (param.PageIndex - 1))
             .Take(param.PageSize)
             .AsNoTracking();
        }
    }
}
