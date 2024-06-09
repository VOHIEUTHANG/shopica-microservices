using Ardalis.Specification;
using Catalog.API.DTOs;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Colors
{
    public class ColorPaginatedFilteredSpec : Specification<Color>
    {
        public ColorPaginatedFilteredSpec(BaseParam param, string? colorname)
        {
            if (param.SortField == "id" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.Id);
            }

            if (!string.IsNullOrEmpty(colorname))
            {
                Query.Search(d => d.ColorName, "%" + colorname + "%");
            }

            Query.Skip(param.PageSize * (param.PageIndex - 1))
             .Take(param.PageSize)
             .AsNoTracking();
        }
    }
}
