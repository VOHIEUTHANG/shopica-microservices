using Catalog.API.DTOs;
using Catalog.API.DTOs.Sizes;

namespace Catalog.API.Interfaces
{
    public interface ISizeService
    {
        public Task<PaginatedResult<SizeResponse>> GetAllAsync(BaseParam param, string? sizeName);
        public Task<SizeResponse> GetByIdAsync(int sizeId);
        public Task<SizeResponse> CreateAsync(SizeCreateRequest request);
        public Task<SizeResponse> UpdateAsync(SizeUpdateRequest request);
        public Task<bool> DeleteAsync(int sizeId);
    }
}
