using Catalog.API.DTOs;
using Catalog.API.DTOs.Brands;

namespace Catalog.API.Interfaces
{
    public interface IBrandService
    {
        public Task<PaginatedResult<BrandResponse>> GetAllAsync(BaseParam param, string? brandName);
        public Task<BrandResponse> GetByIdAsync(int brandId);
        public Task<BrandResponse> CreateAsync(BrandCreateRequest request);
        public Task<BrandResponse> UpdateAsync(BrandUpdateRequest request);
        public Task<bool> DeleteAsync(int brandId);
    }
}
