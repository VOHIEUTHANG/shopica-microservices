using Catalog.API.DTOs.ProductColors;
using Catalog.API.DTOs.ProductImages;
using Catalog.API.DTOs.ProductSizes;

namespace Catalog.API.DTOs.Products
{
    public class ProductUpdateRequest
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public Decimal Price { get; set; }
        public string[] Tags { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public List<ProductSizeUpdateRequest> ProductSizes { get; set; }
        public List<ProductColorUpdateRequest> ProductColors { get; set; }
        public List<ProductImageUpdateRequest> ProductImages { get; set; }
    }
}
