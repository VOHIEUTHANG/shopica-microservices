using Catalog.API.DTOs.ProductColors;
using Catalog.API.DTOs.ProductImages;
using Catalog.API.DTOs.ProductSizes;

namespace Catalog.API.DTOs.Products
{
    public class ProductResponse
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public Decimal Price { get; set; }
        public string[] Tags { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int BrandId { get; set; }
        public string BrandName { get; set; }
        public List<ProductSizeResponse> ProductSizes { get; set; }
        public List<ProductColorResponse> ProductColors { get; set; }
        public List<ProductImageResponse> ProductImages { get; set; }
    }
}
