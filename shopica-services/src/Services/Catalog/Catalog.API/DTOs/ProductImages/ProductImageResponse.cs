namespace Catalog.API.DTOs.ProductImages
{
    public class ProductImageResponse
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ImageUrl { get; set; }
    }
}
