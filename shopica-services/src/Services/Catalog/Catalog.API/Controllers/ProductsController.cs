using Catalog.API.DTOs;
using Catalog.API.DTOs.Products;
using Catalog.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace Catalog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<ProductResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, [FromQuery] ProductFilter productFilter)
        {
            var result = await _productService.GetAllAsync(param, productFilter);

            return Ok(new BaseSuccessResponse<PaginatedResult<ProductResponse>>(result));
        }
        [HttpGet("{productId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<ProductResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int productId)
        {
            var result = await _productService.GetByIdAsync(productId);

            return Ok(new BaseSuccessResponse<ProductResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<ProductResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(ProductCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _productService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<ProductResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<ProductResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(ProductUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _productService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<ProductResponse>(result));
        }
        [HttpDelete("{productId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync(int productId)
        {
            var result = await _productService.DeleteAsync(productId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }

        [HttpGet("get-by-ids")]
        [ProducesResponseType(typeof(BaseSuccessResponse<IEnumerable<ProductResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetByIdsAsync([FromQuery] string productIds)
        {
            var result = await _productService.GetByIdsAsync(productIds);

            return Ok(new BaseSuccessResponse<IEnumerable<ProductResponse>>(result));
        }

        [HttpGet("get-tags")]
        [ProducesResponseType(typeof(BaseSuccessResponse<IEnumerable<string>>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetTagsAsync()
        {
            var result = await _productService.GetTagsAsync();

            return Ok(new BaseSuccessResponse<IEnumerable<string>>(result));
        }

        [HttpGet("get-total-products")]
        [ProducesResponseType(typeof(BaseSuccessResponse<int>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetTotalProductsAsync()
        {
            var result = await _productService.GetTotalProductsAsync();

            return Ok(new BaseSuccessResponse<int>(result));
        }
        [HttpGet("get-product-by-category")]
        [ProducesResponseType(typeof(BaseSuccessResponse<List<ProductByCategory>>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetProductByCategoryAsync()
        {
            var result = await _productService.GetProductByCategoryAsync();

            return Ok(new BaseSuccessResponse<List<ProductByCategory>>(result));
        }
    }
}
