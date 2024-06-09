using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Ordering.API.DTOs;
using Ordering.API.DTOs.OrderDetails;
using Ordering.API.DTOs.Orders;
using Ordering.API.Interfaces;
using System.Net;

namespace Ordering.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<OrderResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, int customerId, string? customerName, string? status)
        {
            var result = await _orderService.GetAllAsync(param, customerId, customerName, status);

            return Ok(new BaseSuccessResponse<PaginatedResult<OrderResponse>>(result));
        }
        [HttpGet("{orderId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<OrderResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int orderId)
        {
            var result = await _orderService.GetByIdAsync(orderId);

            return Ok(new BaseSuccessResponse<OrderResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<OrderResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(OrderCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _orderService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<OrderResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<OrderResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(OrderUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _orderService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<OrderResponse>(result));
        }

        [HttpGet("get-best-seller")]
        [ProducesResponseType(typeof(BaseSuccessResponse<List<ProductByCount>>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> GetBestSellerAsync()
        {
            var result = await _orderService.GetBestSellerAsync();

            return Ok(new BaseSuccessResponse<List<ProductByCount>>(result));
        }
        [HttpGet("get-product-revenues")]
        [ProducesResponseType(typeof(BaseSuccessResponse<List<ProductByRevenues>>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> GetProductRevenuesAsync()
        {
            var result = await _orderService.GetProductRevenuesAsync();

            return Ok(new BaseSuccessResponse<List<ProductByRevenues>>(result));
        }
        [HttpGet("get-total-sales-order")]
        [ProducesResponseType(typeof(BaseSuccessResponse<int>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> GetTotalSalesOrderAsync()
        {
            var result = await _orderService.GetTotalSalesOrderAsync();

            return Ok(new BaseSuccessResponse<int>(result));
        }
        [HttpGet("get-total-revenues")]
        [ProducesResponseType(typeof(BaseSuccessResponse<decimal>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> GetTotalRevenuesAsync()
        {
            var result = await _orderService.GetTotalRevenuesAsync();

            return Ok(new BaseSuccessResponse<decimal>(result));
        }
        [HttpGet("get-product-by-color")]
        [ProducesResponseType(typeof(BaseSuccessResponse<List<ProductByColor>>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> GetProductByColorAsync()
        {
            var result = await _orderService.GetProductByColorAsync();

            return Ok(new BaseSuccessResponse<List<ProductByColor>>(result));
        }
    }
}
