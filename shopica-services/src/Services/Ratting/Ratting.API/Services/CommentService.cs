using AutoMapper;
using Ratting.API.DTOs;
using Ratting.API.DTOs.Comments;
using Ratting.API.Infrastructure;
using Ratting.API.Interfaces;
using Ratting.API.Models;
using Ratting.API.Specifications.Comments;

namespace Ratting.API.Services
{
    public class CommentService : ICommentService
    {
        private readonly IRattingRepository<Comment> _commentRepository;
        private readonly IMapper _mapper;
        public CommentService(
           IRattingRepository<Comment> commentRepository,
           IMapper mapper)
        {
            _commentRepository = commentRepository;
            _mapper = mapper;
        }
        public async Task<CommentResponse> CreateAsync(CommentCreateRequest request)
        {
            var comment = _mapper.Map<Comment>(request);

            await _commentRepository.AddAsync(comment);
            await _commentRepository.SaveChangesAsync();
            return _mapper.Map<CommentResponse>(comment);
        }

        public async Task<bool> DeleteAsync(int commentId)
        {
            var comment = await _commentRepository.FirstOrDefaultAsync(new CommentByIdSpec(commentId));
            if (comment is null) throw new ArgumentException($"Can not find comment with key: {commentId}");

            await _commentRepository.DeleteAsync(comment);
            await _commentRepository.SaveChangesAsync();
            return true;
        }

        public async Task<PaginatedResult<CommentResponse>> GetAllAsync(BaseParam param, string? documentTypes, int documentId)
        {
            var spec = new CommentPaginatedFilteredSpec(param, documentTypes, documentId);
            var comments = await _commentRepository.ListAsync(spec);
            var totalRecords = await _commentRepository.CountAsync(new CommentFilteredSpec(documentTypes, documentId));
            var commentsResponse = _mapper.Map<IEnumerable<CommentResponse>>(comments);
            return new PaginatedResult<CommentResponse>(param.PageIndex, param.PageSize, totalRecords, commentsResponse);
        }

        public async Task<CommentResponse> GetByIdAsync(int commentId)
        {
            var comment = await _commentRepository.FirstOrDefaultAsync(new CommentByIdSpec(commentId));
            if (comment is null) throw new ArgumentException($"Can not find comment with key: {commentId}");
            var result = _mapper.Map<CommentResponse>(comment);
            return result;
        }

        public async Task<CommentResponse> UpdateAsync(CommentUpdateRequest request)
        {
            var comment = await _commentRepository.FirstOrDefaultAsync(new CommentByIdSpec(request.Id));
            if (comment is null) throw new ArgumentException($"Can not find comment with key: {request.Id}");

            comment.Content = request.Content ?? comment.Content;
            comment.Rate = request.Rate;

            await _commentRepository.UpdateAsync(comment);
            await _commentRepository.SaveChangesAsync();

            return _mapper.Map<CommentResponse>(comment);
        }
    }
}
