using Ardalis.Specification;

namespace Payment.API.Specifications.Payments
{
    public class PaymentFilteredSpec : Specification<Models.Payment>
    {
        public PaymentFilteredSpec()
        {
            //if (customerId != 0)
            //{
            //    Query.Where(o => o.CustomerId == customerId);
            //}

            //if (!string.IsNullOrEmpty(status))
            //{
            //    Query.Search(d => d.Status.ToString(), "%" + status + "%");
            //}

            Query.AsNoTracking();
        }
    }
}
