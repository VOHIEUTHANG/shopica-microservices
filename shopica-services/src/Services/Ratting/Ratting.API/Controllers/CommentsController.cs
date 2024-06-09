using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Ratting.API.DTOs;
using Ratting.API.DTOs.Comments;
using Ratting.API.Interfaces;
using System.Net;

namespace Ratting.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;
        public CommentsController(ICommentService commentService)
        {
            _commentService = commentService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<CommentResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, string? documentTypes, int documentId)
        {
            var result = await _commentService.GetAllAsync(param, documentTypes, documentId);

            return Ok(new BaseSuccessResponse<PaginatedResult<CommentResponse>>(result));
        }
        [HttpGet("{commentId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<CommentResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int commentId)
        {
            var result = await _commentService.GetByIdAsync(commentId);

            return Ok(new BaseSuccessResponse<CommentResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<CommentResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(CommentCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _commentService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<CommentResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<CommentResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(CommentUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _commentService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<CommentResponse>(result));
        }
        [HttpDelete("{commentId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync(int commentId)
        {
            var result = await _commentService.DeleteAsync(commentId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }
    }
}
