namespace Inventory.API.DTOs.PurchaseOrders
{
    public class PurchaseOrderDetailCreateRequest
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int ColorId { get; set; }
        public int SizeId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string ColorName { get; set; }
        public string SizeName { get; set; }
        public string ImageUrl { get; set; }
    }
}
