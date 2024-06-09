using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Ratting.API.DTOs;
using Ratting.API.DTOs.Blogs;
using Ratting.API.Interfaces;
using System.Net;

namespace Ratting.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly IBlogService _blogService;
        public BlogsController(IBlogService blogService)
        {
            _blogService = blogService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<BlogResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, string? title, string? tags)
        {
            var result = await _blogService.GetAllAsync(param, title, tags);

            return Ok(new BaseSuccessResponse<PaginatedResult<BlogResponse>>(result));
        }
        [HttpGet("{blogId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<BlogResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int blogId)
        {
            var result = await _blogService.GetByIdAsync(blogId);

            return Ok(new BaseSuccessResponse<BlogResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<BlogResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(BlogCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _blogService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<BlogResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<BlogResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(BlogUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _blogService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<BlogResponse>(result));
        }
        [HttpDelete("{blogId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync(int blogId)
        {
            var result = await _blogService.DeleteAsync(blogId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }

        [HttpGet("get-tags")]
        [ProducesResponseType(typeof(BaseSuccessResponse<IEnumerable<string>>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetBlogTagsAsync()
        {
            var result = await _blogService.GetBlogTagsAsync();

            return Ok(new BaseSuccessResponse<IEnumerable<string>>(result));
        }
    }
}
