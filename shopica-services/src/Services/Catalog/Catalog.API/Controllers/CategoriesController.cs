using Catalog.API.DTOs;
using Catalog.API.DTOs.Categories;
using Catalog.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace Catalog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<CategoryResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, string? categoryName)
        {
            var result = await _categoryService.GetAllAsync(param, categoryName);

            return Ok(new BaseSuccessResponse<PaginatedResult<CategoryResponse>>(result));
        }
        [HttpGet("{categoryId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<CategoryResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int categoryId)
        {
            var result = await _categoryService.GetByIdAsync(categoryId);

            return Ok(new BaseSuccessResponse<CategoryResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<CategoryResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(CategoryCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _categoryService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<CategoryResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<CategoryResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(CategoryUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _categoryService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<CategoryResponse>(result));
        }
        [HttpDelete("{categoryId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync(int categoryId)
        {
            var result = await _categoryService.DeleteAsync(categoryId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }
    }
}
