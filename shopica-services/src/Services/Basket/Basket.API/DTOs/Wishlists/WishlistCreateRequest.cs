namespace Basket.API.DTOs.Wishlists
{
    public class WishlistCreateRequest
    {
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
    }
}
