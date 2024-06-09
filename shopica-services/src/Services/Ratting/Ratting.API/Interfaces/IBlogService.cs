using Ratting.API.DTOs;
using Ratting.API.DTOs.Blogs;

namespace Ratting.API.Interfaces
{
    public interface IBlogService
    {
        public Task<PaginatedResult<BlogResponse>> GetAllAsync(BaseParam param, string? title, string? tag);
        public Task<BlogResponse> GetByIdAsync(int blogId);
        public Task<BlogResponse> CreateAsync(BlogCreateRequest request);
        public Task<BlogResponse> UpdateAsync(BlogUpdateRequest request);
        public Task<bool> DeleteAsync(int blogId);
        public Task<IEnumerable<string>> GetBlogTagsAsync();
    }
}
