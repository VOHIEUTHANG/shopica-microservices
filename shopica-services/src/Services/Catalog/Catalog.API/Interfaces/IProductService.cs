using Catalog.API.DTOs;
using Catalog.API.DTOs.Products;

namespace Catalog.API.Interfaces
{
    public interface IProductService
    {
        public Task<PaginatedResult<ProductResponse>> GetAllAsync(BaseParam param, ProductFilter productFilter);
        public Task<ProductResponse> GetByIdAsync(int productId);
        public Task<IEnumerable<ProductResponse>> GetByIdsAsync(string productIds);
        public Task<ProductResponse> CreateAsync(ProductCreateRequest request);
        public Task<ProductResponse> UpdateAsync(ProductUpdateRequest request);
        public Task<bool> DeleteAsync(int productId);
        public Task<IEnumerable<string>> GetTagsAsync();
        public Task<int> GetTotalProductsAsync();
        public Task<List<ProductByCategory>> GetProductByCategoryAsync();
    }
}
