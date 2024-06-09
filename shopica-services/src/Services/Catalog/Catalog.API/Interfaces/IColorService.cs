using Catalog.API.DTOs;
using Catalog.API.DTOs.Colors;

namespace Catalog.API.Interfaces
{
    public interface IColorService
    {
        public Task<PaginatedResult<ColorResponse>> GetAllAsync(BaseParam param, string? colorName);
        public Task<ColorResponse> GetByIdAsync(int colorId);
        public Task<ColorResponse> CreateAsync(ColorCreateRequest request);
        public Task<ColorResponse> UpdateAsync(ColorUpdateRequest request);
        public Task<bool> DeleteAsync(int colorId);
    }
}
