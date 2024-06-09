using Catalog.API.DTOs;
using Catalog.API.DTOs.Categories;

namespace Catalog.API.Interfaces
{
    public interface ICategoryService
    {
        public Task<PaginatedResult<CategoryResponse>> GetAllAsync(BaseParam param, string? categoryName);
        public Task<CategoryResponse> GetByIdAsync(int categoryId);
        public Task<CategoryResponse> CreateAsync(CategoryCreateRequest request);
        public Task<CategoryResponse> UpdateAsync(CategoryUpdateRequest request);
        public Task<bool> DeleteAsync(int categoryId);
    }
}
