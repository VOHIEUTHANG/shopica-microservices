using Ardalis.Specification;
using Basket.API.Models;

namespace Basket.API.Specifications.Promotions
{
    public class PromotionResultByCustPromoCodeSpec : Specification<PromotionResult>
    {
        public PromotionResultByCustPromoCodeSpec(int customerId, string promotionCode)
        {
            if (!string.IsNullOrEmpty(promotionCode))
            {
                Query.Where(pr => pr.PromotionCode == promotionCode);
            }

            Query.Where(pr => pr.CustomerId == customerId)
                .AsNoTracking();
        }
    }
}
