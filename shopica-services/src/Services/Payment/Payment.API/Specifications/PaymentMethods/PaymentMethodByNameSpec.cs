using Ardalis.Specification;
using Payment.API.Models;

namespace Payment.API.Specifications.PaymentMethods
{
    public class PaymentMethodByNameSpec : Specification<PaymentMethod>, ISingleResultSpecification<PaymentMethod>
    {
        public PaymentMethodByNameSpec(string name)
        {
            Query.Where(pm => pm.Name == name);
        }
    }
}
