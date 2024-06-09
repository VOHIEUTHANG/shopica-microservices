using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Payment.API.DTOs;
using Payment.API.DTOs.Payments;
using Payment.API.Interfaces;
using System.Net;

namespace Payment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<PaymentResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param)
        {
            var result = await _paymentService.GetAllAsync(param);

            return Ok(new BaseSuccessResponse<PaginatedResult<PaymentResponse>>(result));
        }
        [HttpGet("{paymentId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaymentResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int paymentId)
        {
            var result = await _paymentService.GetByIdAsync(paymentId);

            return Ok(new BaseSuccessResponse<PaymentResponse>(result));
        }

        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaymentResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(PaymentCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _paymentService.AddAsync(request);

            return Ok(new BaseSuccessResponse<PaymentResponse>(result));
        }
    }
}
