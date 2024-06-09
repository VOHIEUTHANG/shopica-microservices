using Ardalis.Specification;

namespace Payment.API.Specifications.Payments
{
    public class PaymentByIdSpec : Specification<Models.Payment>, ISingleResultSpecification<Models.Payment>
    {
        public PaymentByIdSpec(int paymentId)
        {
            Query.Include(o => o.Transactions)
                 .Include(o => o.PaymentMethod)
                .Where(b => b.Id == paymentId);
        }
    }
}
