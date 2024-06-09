using Catalog.API.DTOs;
using Catalog.API.DTOs.Brands;
using Catalog.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace Catalog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandsController : ControllerBase
    {
        private readonly IBrandService _brandService;
        public BrandsController(IBrandService brandService)
        {
            _brandService = brandService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<BrandResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, string? brandName)
        {
            var result = await _brandService.GetAllAsync(param, brandName);

            return Ok(new BaseSuccessResponse<PaginatedResult<BrandResponse>>(result));
        }
        [HttpGet("{brandId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<BrandResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int brandId)
        {
            var result = await _brandService.GetByIdAsync(brandId);

            return Ok(new BaseSuccessResponse<BrandResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<BrandResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(BrandCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _brandService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<BrandResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<BrandResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(BrandUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _brandService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<BrandResponse>(result));
        }
        [HttpDelete("{brandId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync(int brandId)
        {
            var result = await _brandService.DeleteAsync(brandId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }
    }
}
