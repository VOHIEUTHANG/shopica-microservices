using Ardalis.Specification;
using Catalog.API.DTOs;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Brands
{
    public class BrandPaginatedFilteredSpec : Specification<Brand>
    {
        public BrandPaginatedFilteredSpec(BaseParam param, string? brandName)
        {
            if (param.SortField == "id" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.Id);
            }

            if (!string.IsNullOrEmpty(brandName))
            {
                Query.Search(d => d.BrandName, "%" + brandName + "%");
            }

            Query.Skip(param.PageSize * (param.PageIndex - 1))
             .Take(param.PageSize)
             .AsNoTracking();
        }
    }
}
