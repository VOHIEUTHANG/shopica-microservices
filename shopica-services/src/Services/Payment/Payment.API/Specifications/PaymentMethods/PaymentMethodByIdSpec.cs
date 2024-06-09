using Ardalis.Specification;
using Payment.API.Models;

namespace Payment.API.Specifications.PaymentMethods
{
    public class PaymentMethodByIdSpec : Specification<PaymentMethod>, ISingleResultSpecification<PaymentMethod>
    {
        public PaymentMethodByIdSpec(int id)
        {
            Query.Where(pm => pm.Id == id);
        }
    }
}
