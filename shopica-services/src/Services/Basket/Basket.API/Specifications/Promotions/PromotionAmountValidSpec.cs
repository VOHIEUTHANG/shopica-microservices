using Ardalis.Specification;
using Basket.API.Models;
using Basket.API.Models.Enums;

namespace Basket.API.Specifications.Promotions
{
    public class PromotionAmountValidSpec : Specification<Promotion>, ISingleResultSpecification<Promotion>
    {
        public PromotionAmountValidSpec(DateTime orderDate, decimal totalPrice)
        {
            Query.Where(p => p.Active
                    && (p.Type == PromotionType.Amount || p.Type == PromotionType.Discount)
                    && p.StartDate <= orderDate
                    && p.EndDate >= orderDate
                    && p.SalesByAmount <= totalPrice)
                .AsNoTracking();
        }
    }
}