using Azure.Core;
using Basket.API.DTOs;
using Basket.API.DTOs.CartItems;
using Basket.API.DTOs.Carts;
using Basket.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Primitives;
using System.Net;

namespace Basket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly ICartService _cartService;
        public CartsController(ICartService cartService)
        {
            _cartService = cartService;
        }
        [HttpGet("{customerId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<CartResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int customerId)
        {
            var result = await _cartService.GetByIdAsync(customerId);

            return Ok(new BaseSuccessResponse<CartResponse>(result));
        }
        [HttpPost("add-to-cart")]
        [ProducesResponseType(typeof(BaseSuccessResponse<CartResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> AddToCartAsync(CartItemCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _cartService.AddToCartAsync(request);

            return Ok(new BaseSuccessResponse<CartResponse>(result));
        }
        [HttpDelete]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync([FromQuery] int customerId, int productId, int sizeId, int colorId)
        {
            var result = await _cartService.RemoveCartItemAsync(customerId, productId, sizeId, colorId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }
        [HttpGet("empty-cart")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> EmptyCartAsync([FromQuery] int customerId)
        {
            var result = await _cartService.EmptyCartAsync(customerId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<CartResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(CartItemUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _cartService.UpdateCartAsync(request);

            return Ok(new BaseSuccessResponse<CartResponse>(result));
        }
    }
}
