using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Ordering.API.DTOs;
using Ordering.API.DTOs.Addresses;
using Ordering.API.Interfaces;
using System.Net;

namespace Ordering.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressesController : ControllerBase
    {
        private readonly IAddressService _addressService;
        public AddressesController(IAddressService addressService)
        {
            _addressService = addressService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<AddressResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, int customerId)
        {
            var result = await _addressService.GetAllAsync(param, customerId);

            return Ok(new BaseSuccessResponse<PaginatedResult<AddressResponse>>(result));
        }
        [HttpGet("{addressId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<AddressResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int addressId)
        {
            var result = await _addressService.GetByIdAsync(addressId);

            return Ok(new BaseSuccessResponse<AddressResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<AddressResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(AddressCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _addressService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<AddressResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<AddressResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(AddressUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _addressService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<AddressResponse>(result));
        }
        [HttpDelete("{addressId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync(int addressId)
        {
            var result = await _addressService.DeleteAsync(addressId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }

        [HttpGet("get-default")]
        [ProducesResponseType(typeof(BaseSuccessResponse<AddressResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetDefaultAddressAsync(int customerId)
        {
            var result = await _addressService.GetDefaultAddressAsync(customerId);

            return Ok(new BaseSuccessResponse<AddressResponse>(result));
        }
    }
}
