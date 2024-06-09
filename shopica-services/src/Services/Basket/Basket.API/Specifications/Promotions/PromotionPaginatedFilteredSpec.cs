using Ardalis.Specification;
using Basket.API.DTOs;
using Basket.API.Models;

namespace Basket.API.Specifications.Promotions
{
    public class PromotionPaginatedFilteredSpec : Specification<Promotion>
    {
        public PromotionPaginatedFilteredSpec(BaseParam param, string? description)
        {
            if (param.SortField == "code" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.Code);
            }

            if (!string.IsNullOrEmpty(description))
            {
                Query.Search(d => d.Description, "%" + description + "%");
            }

            Query
                .Skip(param.PageSize * (param.PageIndex - 1))
                 .Take(param.PageSize)
                 .AsNoTracking();
        }
    }
}
