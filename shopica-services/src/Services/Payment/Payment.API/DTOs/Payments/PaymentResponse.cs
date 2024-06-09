using Payment.API.DTOs.Transactions;
using Payment.API.Models.Enums;

namespace Payment.API.DTOs.Payments
{
    public class PaymentResponse
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public int PaymentMethodId { get; set; }
        public string MethodName { get; set; }
        public PaymentStatus paymentStatus { get; set; }
        public int CustomerId { get; set; }
        public IEnumerable<TransactionResponse> Transactions { get; set; }
    }
}
