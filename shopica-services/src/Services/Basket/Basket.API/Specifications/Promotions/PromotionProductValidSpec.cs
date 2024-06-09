using Ardalis.Specification;
using Basket.API.Models;
using Basket.API.Models.Enums;

namespace Basket.API.Specifications.Promotions
{
    public class PromotionProductValidSpec : Specification<Promotion>, ISingleResultSpecification<Promotion>
    {
        public PromotionProductValidSpec(DateTime orderDate)
        {
            Query.Where(p => p.Active
                    && p.Type == PromotionType.Product
                    && p.StartDate <= orderDate
                    && p.EndDate >= orderDate)
              .AsNoTracking();
        }
    }
}