namespace Payment.API.DTOs.Transactions
{
    public class TransactionCreateRequest
    {
        public string Description { get; set; }
        public DateTime TransactionDate { get; set; }
        public string ExternalTransactionId { get; set; } = string.Empty;
    }
}
