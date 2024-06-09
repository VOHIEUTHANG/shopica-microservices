using Inventory.API.DTOs.PurchaseOrders;
using Inventory.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace Inventory.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly IPurchaseOrderService _purchaseorderService;
        public PurchaseOrdersController(IPurchaseOrderService purchaseorderService)
        {
            _purchaseorderService = purchaseorderService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<PurchaseOrderResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, string? status)
        {
            var result = await _purchaseorderService.GetAllAsync(param, status);

            return Ok(new BaseSuccessResponse<PaginatedResult<PurchaseOrderResponse>>(result));
        }
        [HttpGet("{purchaseOrderId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<PurchaseOrderResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int purchaseOrderId)
        {
            var result = await _purchaseorderService.GetByIdAsync(purchaseOrderId);

            return Ok(new BaseSuccessResponse<PurchaseOrderResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<PurchaseOrderResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(PurchaseOrderCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _purchaseorderService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<PurchaseOrderResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<PurchaseOrderResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(PurchaseOrderUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _purchaseorderService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<PurchaseOrderResponse>(result));
        }
    }
}
