using Catalog.API.DTOs;
using Catalog.API.DTOs.ProductImages;
using Catalog.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace Catalog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductImagesController : ControllerBase
    {
        private readonly IProductImageService _productImageService;
        public ProductImagesController(IProductImageService productImageService)
        {
            _productImageService = productImageService;
        }

        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<ProductImageResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(ProductImageCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _productImageService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<ProductImageResponse>(result));
        }

        [HttpDelete("{productImageId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync(int productImageId, string imageUrl)
        {
            var result = await _productImageService.DeleteAsync(productImageId, imageUrl);

            return Ok(new BaseSuccessResponse<bool>(result));
        }
    }
}
