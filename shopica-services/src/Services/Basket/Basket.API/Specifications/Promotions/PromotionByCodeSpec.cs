using Ardalis.Specification;
using Basket.API.Models;

namespace Basket.API.Specifications.Promotions
{
    public class PromotionByCodeSpec : Specification<Promotion>, ISingleResultSpecification<Promotion>
    {
        public PromotionByCodeSpec(string code)
        {
            Query.Where(p => p.Code == code);
        }
    }
}
