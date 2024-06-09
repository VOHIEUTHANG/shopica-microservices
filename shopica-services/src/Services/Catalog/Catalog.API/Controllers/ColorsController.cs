using Catalog.API.DTOs;
using Catalog.API.DTOs.Colors;
using Catalog.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace Catalog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColorsController : ControllerBase
    {
        private readonly IColorService _colorService;
        public ColorsController(IColorService colorService)
        {
            _colorService = colorService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<ColorResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, string? colorName)
        {
            var result = await _colorService.GetAllAsync(param, colorName);

            return Ok(new BaseSuccessResponse<PaginatedResult<ColorResponse>>(result));
        }
        [HttpGet("{colorId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<ColorResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int colorId)
        {
            var result = await _colorService.GetByIdAsync(colorId);

            return Ok(new BaseSuccessResponse<ColorResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<ColorResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(ColorCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _colorService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<ColorResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<ColorResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(ColorUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _colorService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<ColorResponse>(result));
        }
        [HttpDelete("{colorId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync(int colorId)
        {
            var result = await _colorService.DeleteAsync(colorId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }
    }
}
