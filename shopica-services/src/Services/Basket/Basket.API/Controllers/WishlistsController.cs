using Basket.API.DTOs;
using Basket.API.DTOs.Wishlists;
using Basket.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace Basket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistsController : ControllerBase
    {
        private readonly IWishlistService _wishlistService;
        public WishlistsController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<WishlistResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, int customerId)
        {
            var result = await _wishlistService.GetAllAsync(param, customerId);

            return Ok(new BaseSuccessResponse<PaginatedResult<WishlistResponse>>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<WishlistResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(WishlistCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _wishlistService.AddAsync(request);

            return Ok(new BaseSuccessResponse<WishlistResponse>(result));
        }
        [HttpDelete]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync([FromQuery] int customerId, [FromQuery] int productId)
        {
            var result = await _wishlistService.DeleteAsync(customerId, productId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }
    }
}
