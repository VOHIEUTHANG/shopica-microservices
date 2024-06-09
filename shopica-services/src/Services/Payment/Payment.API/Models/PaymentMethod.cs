namespace Payment.API.Models
{
    public class PaymentMethod : BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }
        public string ImageUrl { get; set; }
        public IEnumerable<Payment> Payments { get; set; }
    }
}
