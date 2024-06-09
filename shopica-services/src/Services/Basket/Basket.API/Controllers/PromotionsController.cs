using Basket.API.DTOs;
using Basket.API.DTOs.PromotionCalculations;
using Basket.API.DTOs.Promotions;
using Basket.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace Basket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionsController : ControllerBase
    {
        private readonly IPromotionService _promotionService;
        public PromotionsController(IPromotionService promotionService)
        {
            _promotionService = promotionService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<PromotionResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, string? description)
        {
            var result = await _promotionService.GetAllAsync(param, description);

            return Ok(new BaseSuccessResponse<PaginatedResult<PromotionResponse>>(result));
        }
        [HttpPost("get-valid-promotions")]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<PromotionResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetValidPromotionAsync([FromQuery] BaseParam param, PromotionApplyRequest request)
        {
            var result = await _promotionService.GetValidPromotionAsync(param, request);

            return Ok(new BaseSuccessResponse<PaginatedResult<PromotionResponse>>(result));
        }

        [HttpGet("{promotionCode}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<PromotionResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(string promotionCode)
        {
            var result = await _promotionService.GetByIdAsync(promotionCode);

            return Ok(new BaseSuccessResponse<PromotionResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<PromotionResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(PromotionCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _promotionService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<PromotionResponse>(result));
        }

        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<PromotionResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(PromotionUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _promotionService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<PromotionResponse>(result));
        }

        [HttpDelete("{promotionCode}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync(string promotionCode)
        {
            var result = await _promotionService.DeleteAsync(promotionCode);

            return Ok(new BaseSuccessResponse<bool>(result));
        }

        [HttpPost("apply-promotion")]
        [ProducesResponseType(typeof(BaseSuccessResponse<PromotionApplyResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> ApplyPromotionAsync(PromotionApplyRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _promotionService.ApplyPromotionAsync(request);

            return Ok(new BaseSuccessResponse<PromotionApplyResponse>(result));
        }

        [HttpGet("unapply-promotion")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> UnApplyPromotionAsync([FromQuery] int customerId, [FromQuery] string promotionCode)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _promotionService.UnApplyPromotionAsync(customerId, promotionCode);

            return Ok(new BaseSuccessResponse<bool>(result));
        }
    }
}
