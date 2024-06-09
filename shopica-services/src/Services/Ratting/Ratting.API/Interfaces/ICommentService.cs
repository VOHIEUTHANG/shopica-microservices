using Ratting.API.DTOs;
using Ratting.API.DTOs.Comments;

namespace Ratting.API.Interfaces
{
    public interface ICommentService
    {
        public Task<PaginatedResult<CommentResponse>> GetAllAsync(BaseParam param, string? documentTypes, int documentId);
        public Task<CommentResponse> GetByIdAsync(int commentId);
        public Task<CommentResponse> CreateAsync(CommentCreateRequest request);
        public Task<CommentResponse> UpdateAsync(CommentUpdateRequest request);
        public Task<bool> DeleteAsync(int commentId);
    }
}
