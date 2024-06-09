using AutoMapper;
using Ratting.API.DTOs;
using Ratting.API.DTOs.Blogs;
using Ratting.API.Infrastructure;
using Ratting.API.Interfaces;
using Ratting.API.Models;
using Ratting.API.Specifications.Blogs;

namespace Ratting.API.Services
{
    public class BlogService : IBlogService
    {
        private readonly IRattingRepository<Blog> _blogRepository;
        private readonly IMapper _mapper;
        public BlogService(
           IRattingRepository<Blog> blogRepository,
           IMapper mapper)
        {
            _blogRepository = blogRepository;
            _mapper = mapper;
        }
        public async Task<BlogResponse> CreateAsync(BlogCreateRequest request)
        {
            var blog = _mapper.Map<Blog>(request);

            await _blogRepository.AddAsync(blog);
            await _blogRepository.SaveChangesAsync();
            return _mapper.Map<BlogResponse>(blog);
        }

        public async Task<bool> DeleteAsync(int blogId)
        {
            var blog = await _blogRepository.FirstOrDefaultAsync(new BlogByIdSpec(blogId));
            if (blog is null) throw new ArgumentException($"Can not find blog with key: {blogId}");

            await _blogRepository.DeleteAsync(blog);
            await _blogRepository.SaveChangesAsync();
            return true;
        }

        public async Task<PaginatedResult<BlogResponse>> GetAllAsync(BaseParam param, string? title, string? tag)
        {
            var spec = new BlogPaginatedFilteredSpec(param, title, tag);
            var blogs = await _blogRepository.ListAsync(spec);
            var totalRecords = await _blogRepository.CountAsync(new BlogFilteredSpec(title, tag));
            var blogsResponse = _mapper.Map<IEnumerable<BlogResponse>>(blogs);
            return new PaginatedResult<BlogResponse>(param.PageIndex, param.PageSize, totalRecords, blogsResponse);
        }

        public async Task<IEnumerable<string>> GetBlogTagsAsync()
        {
            var blogTags = await _blogRepository.ListAsync(new BlogTagsSpec());
            var result = blogTags.SelectMany(x => x).Distinct();
            return result;
        }

        public async Task<BlogResponse> GetByIdAsync(int blogId)
        {
            var blog = await _blogRepository.FirstOrDefaultAsync(new BlogByIdSpec(blogId));
            if (blog is null) throw new ArgumentException($"Can not find blog with key: {blogId}");
            var result = _mapper.Map<BlogResponse>(blog);
            return result;
        }

        public async Task<BlogResponse> UpdateAsync(BlogUpdateRequest request)
        {
            var blog = await _blogRepository.FirstOrDefaultAsync(new BlogByIdSpec(request.Id));
            if (blog is null) throw new ArgumentException($"Can not find blog with key: {request.Id}");

            blog.Content = request.Content ?? blog.Content;
            blog.Tags = request.Tags ?? blog.Tags;
            blog.Title = request.Title ?? blog.Title;
            blog.Summary = request.Summary ?? blog.Summary;
            blog.BackgroundUrl = request.BackgroundUrl ?? blog.BackgroundUrl;

            await _blogRepository.UpdateAsync(blog);
            await _blogRepository.SaveChangesAsync();

            return _mapper.Map<BlogResponse>(blog);
        }
    }
}
