using AutoMapper;
using Catalog.API.DTOs.ProductImages;
using Catalog.API.Infrastructure;
using Catalog.API.IntegrationEvents.Events;
using Catalog.API.Interfaces;
using Catalog.API.Models;
using Catalog.API.Specifications.ProductImages;

namespace Catalog.API.Services
{
    public class ProductImageService : IProductImageService
    {
        private readonly ICatalogRepository<ProductImage> _productImageRepository;
        private readonly ICatalogIntegrationEventService _integrationEventService;
        private readonly IMapper _mapper;
        public ProductImageService(
           ICatalogRepository<ProductImage> productImageRepository,
           ICatalogIntegrationEventService integrationEventService,
           IMapper mapper)
        {
            _productImageRepository = productImageRepository;
            _integrationEventService = integrationEventService;
            _mapper = mapper;
        }
        public async Task<ProductImageResponse> CreateAsync(ProductImageCreateRequest request)
        {
            var productImage = _mapper.Map<ProductImage>(request);

            await _productImageRepository.AddAsync(productImage);
            await _productImageRepository.SaveChangesAsync();
            return _mapper.Map<ProductImageResponse>(productImage);
        }

        public async Task<bool> DeleteAsync(int productImageId, string imageUrl)
        {
            if (productImageId == 0)
            {
                var @event = new ProductImageDeletedIntegrationEvent(productImageId, 0, imageUrl);

                await _integrationEventService.SaveEventAndCatalogContextChangesAsync(@event);
                await _integrationEventService.PublishThroughEventBusAsync(@event);
            }
            else
            {
                var productImage = await _productImageRepository.FirstOrDefaultAsync(new ProductImageByIdSpec(productImageId));
                if (productImage is null) throw new ArgumentException($"Can not find productImage with key: {productImageId}");

                await _productImageRepository.DeleteAsync(productImage);

                var @event = new ProductImageDeletedIntegrationEvent(productImage.Id, productImage.ProductId, productImage.ImageUrl);

                await _integrationEventService.SaveEventAndCatalogContextChangesAsync(@event);
                await _integrationEventService.PublishThroughEventBusAsync(@event);
            }

            return true;
        }
    }
}
