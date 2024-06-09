using Catalog.API.DTOs.ProductColors;
using Catalog.API.DTOs.ProductImages;
using Catalog.API.DTOs.ProductSizes;

namespace Catalog.API.DTOs.Products
{
    public class ProductCreateRequest
    {
        public string ProductName { get; set; }
        public Decimal Price { get; set; }
        public string[] Tags { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public List<ProductSizeCreateRequest> ProductSizes { get; set; }
        public List<ProductColorCreateRequest> ProductColors { get; set; }
        public List<ProductImageCreateRequest> ProductImages { get; set; }
    }
}
