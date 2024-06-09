using Ardalis.Specification;
using Basket.API.Models;

namespace Basket.API.Specifications.Promotions
{
    public class PromotionFilteredSpec : Specification<Promotion>
    {
        public PromotionFilteredSpec(string? description)
        {

            if (!string.IsNullOrEmpty(description))
            {
                Query.Search(d => d.Description, "%" + description + "%");
            }

            Query.AsNoTracking();
        }
    }
}
