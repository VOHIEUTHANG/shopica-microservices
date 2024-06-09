namespace Basket.API.Models
{
    public class Wishlist : BaseEntity
    {
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
    }
}
