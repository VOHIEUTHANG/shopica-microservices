using Inventory.API.DTOs.WarehouseEntries;
using Inventory.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Inventory.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly IWarehouseEntryService _warehouseEntryService;
        public InventoryController(IWarehouseEntryService warehouseEntryService)
        {
            _warehouseEntryService = warehouseEntryService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<WarehouseEntryResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, string? documentTypes, string? productName)
        {
            var result = await _warehouseEntryService.GetAllAsync(param, documentTypes, productName);

            return Ok(new BaseSuccessResponse<PaginatedResult<WarehouseEntryResponse>>(result));
        }
        [HttpGet("get-available-quantity")]
        [ProducesResponseType(typeof(BaseSuccessResponse<int>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> EmptyCartAsync([FromQuery] int productId, int colorId, int sizeId)
        {
            var result = await _warehouseEntryService.GetAvailableQuantityAsync(productId, colorId, sizeId);

            return Ok(new BaseSuccessResponse<int>(result));
        }
    }
}
