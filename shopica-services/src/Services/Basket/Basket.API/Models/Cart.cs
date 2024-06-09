namespace Basket.API.Models
{
    public class Cart : BaseEntity
    {
        public int CustomerId { get; set; }
        public decimal TotalPrice { get; set; }
        public IList<CartItem> CartItems { get; set; }
    }
}
