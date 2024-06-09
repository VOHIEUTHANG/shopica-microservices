using Catalog.API.DTOs.ProductImages;

namespace Catalog.API.Interfaces
{
    public interface IProductImageService
    {
        public Task<ProductImageResponse> CreateAsync(ProductImageCreateRequest request);
        public Task<bool> DeleteAsync(int productImageId, string imageUrl);
    }
}
