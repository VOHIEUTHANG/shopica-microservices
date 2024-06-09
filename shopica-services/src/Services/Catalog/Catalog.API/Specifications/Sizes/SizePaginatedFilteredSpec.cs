using Ardalis.Specification;
using Catalog.API.DTOs;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Sizes
{
    public class SizePaginatedFilteredSpec : Specification<Size>
    {
        public SizePaginatedFilteredSpec(BaseParam param, string? sizeName)
        {
            if (param.SortField == "id" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.Id);
            }

            if (!string.IsNullOrEmpty(sizeName))
            {
                Query.Search(d => d.SizeName, "%" + sizeName + "%");
            }

            Query.Skip(param.PageSize * (param.PageIndex - 1))
             .Take(param.PageSize)
             .AsNoTracking();
        }
    }
}
