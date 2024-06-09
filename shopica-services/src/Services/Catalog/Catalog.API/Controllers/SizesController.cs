using Catalog.API.DTOs;
using Catalog.API.DTOs.Sizes;
using Catalog.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace Catalog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SizesController : ControllerBase
    {
        private readonly ISizeService _sizeService;
        public SizesController(ISizeService sizeService)
        {
            _sizeService = sizeService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<SizeResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, string? sizeName)
        {
            var result = await _sizeService.GetAllAsync(param, sizeName);

            return Ok(new BaseSuccessResponse<PaginatedResult<SizeResponse>>(result));
        }
        [HttpGet("{sizeId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<SizeResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int sizeId)
        {
            var result = await _sizeService.GetByIdAsync(sizeId);

            return Ok(new BaseSuccessResponse<SizeResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<SizeResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(SizeCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _sizeService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<SizeResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<SizeResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(SizeUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _sizeService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<SizeResponse>(result));
        }
        [HttpDelete("{sizeId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync(int sizeId)
        {
            var result = await _sizeService.DeleteAsync(sizeId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }
    }
}
