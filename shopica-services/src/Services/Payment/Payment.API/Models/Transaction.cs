namespace Payment.API.Models
{
    public class Transaction : BaseEntity
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime TransactionDate { get; set; }
        public string ExternalTransactionId { get; set; }
        public int PaymentId { get; set; }
        public Payment Payment { get; set; }
    }
}
