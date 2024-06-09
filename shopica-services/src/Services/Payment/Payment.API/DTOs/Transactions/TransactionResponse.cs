namespace Payment.API.DTOs.Transactions
{
    public class TransactionResponse
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime TransactionDate { get; set; }
        public string ExternalTransactionId { get; set; }
    }
}
