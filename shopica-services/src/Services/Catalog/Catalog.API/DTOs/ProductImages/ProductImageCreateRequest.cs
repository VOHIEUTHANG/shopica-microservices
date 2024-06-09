namespace Catalog.API.DTOs.ProductImages
{
    public class ProductImageCreateRequest
    {
        public int ProductId { get; set; }
        public string ImageUrl { get; set; }
    }
}
