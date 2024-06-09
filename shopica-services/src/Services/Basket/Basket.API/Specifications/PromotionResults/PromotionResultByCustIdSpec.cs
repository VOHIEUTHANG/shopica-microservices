using Ardalis.Specification;
using Basket.API.Models;

namespace Basket.API.Specifications.PromotionResults
{
    public class PromotionResultByCustIdSpec : Specification<PromotionResult>
    {
        public PromotionResultByCustIdSpec(int customerId)
        {
            Query.Where(pr => pr.CustomerId == customerId && pr.OrderId == 0)
                .AsNoTracking();
        }
    }
}
