using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Payment.API.DTOs;
using Payment.API.DTOs.PaymentMethods;
using Payment.API.Interfaces;
using System.Net;

namespace Payment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentMethodsController : ControllerBase
    {
        private readonly IPaymentMethodService _paymentmethodService;
        public PaymentMethodsController(IPaymentMethodService paymentmethodService)
        {
            _paymentmethodService = paymentmethodService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<PaymentMethodResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, string? paymentMethodName)
        {
            var result = await _paymentmethodService.GetAllAsync(param, paymentMethodName);

            return Ok(new BaseSuccessResponse<PaginatedResult<PaymentMethodResponse>>(result));
        }
        [HttpGet("{paymentmethodId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaymentMethodResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int paymentmethodId)
        {
            var result = await _paymentmethodService.GetByIdAsync(paymentmethodId);

            return Ok(new BaseSuccessResponse<PaymentMethodResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaymentMethodResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(PaymentMethodCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _paymentmethodService.AddAsync(request);

            return Ok(new BaseSuccessResponse<PaymentMethodResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaymentMethodResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(PaymentMethodUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _paymentmethodService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<PaymentMethodResponse>(result));
        }
        [HttpDelete("{paymentmethodId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync(int paymentmethodId)
        {
            var result = await _paymentmethodService.DeleteAsync(paymentmethodId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }
    }
}
