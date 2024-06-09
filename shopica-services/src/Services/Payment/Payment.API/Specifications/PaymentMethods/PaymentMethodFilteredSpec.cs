using Ardalis.Specification;
using Payment.API.Models;

namespace Payment.API.Specifications.PaymentMethods
{
    public class PaymentMethodFilteredSpec : Specification<PaymentMethod>
    {
        public PaymentMethodFilteredSpec(string? name)
        {
            if (!string.IsNullOrEmpty(name))
            {
                Query.Search(d => d.Name, "%" + name + "%");
            }

            Query.AsNoTracking();
        }
    }
}
