namespace Ordering.API.DTOs.OrderDetails
{
    public class OrderDetailUpdateRequest
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string ProductName { get; set; }
        public int SizeId { get; set; }
        public int ColorId { get; set; }
        public string ColorName { get; set; }
        public string SizeName { get; set; }
        public string ImageUrl { get; set; }
    }
}
