using Payment.API.Models.Enums;

namespace Payment.API.Models
{
    public class Payment : BaseEntity
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public int PaymentMethodId { get; set; }
        public PaymentStatus paymentStatus { get; set; }
        public int CustomerId { get; set; }

        public PaymentMethod PaymentMethod { get; set; }
        public IEnumerable<Transaction> Transactions { get; set; }
    }
}
