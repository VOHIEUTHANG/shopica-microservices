using AutoMapper;
using Catalog.API.DTOs;
using Catalog.API.DTOs.Products;
using Catalog.API.Infrastructure;
using Catalog.API.IntegrationEvents.Events;
using Catalog.API.Interfaces;
using Catalog.API.Models;
using Catalog.API.Specifications.Products;
using Microsoft.EntityFrameworkCore;

namespace Catalog.API.Services
{
    public class ProductService : IProductService
    {
        private readonly ICatalogRepository<Product> _productRepository;
        private readonly ICatalogIntegrationEventService _integrationEventService;
        private readonly ICatalogRepository<ProductImage> _productImageRepository;

        private readonly IMapper _mapper;
        public ProductService(
           ICatalogRepository<Product> productRepository,
           ICatalogIntegrationEventService integrationEventService,
           ICatalogRepository<ProductImage> productImageRepository,
           IMapper mapper)
        {
            _productRepository = productRepository;
            _integrationEventService = integrationEventService;
            _productImageRepository = productImageRepository;
            _mapper = mapper;
        }
        public async Task<ProductResponse> CreateAsync(ProductCreateRequest request)
        {
            var product = _mapper.Map<Product>(request);

            await _productRepository.AddAsync(product);

            var @event = new ProductCreatedIntegrationEvent(product.Id, product.ProductName, product.ProductImages.FirstOrDefault()?.ImageUrl);

            await _integrationEventService.SaveEventAndCatalogContextChangesAsync(@event);
            await _integrationEventService.PublishThroughEventBusAsync(@event);

            return _mapper.Map<ProductResponse>(product);
        }

        public async Task<bool> DeleteAsync(int productId)
        {
            var product = await _productRepository.FirstOrDefaultAsync(new ProductByIdSpec(productId));
            if (product is null) throw new ArgumentException($"Can not find product with key: {productId}");

            var images = product.ProductImages.ToList();

            await _productRepository.DeleteAsync(product);

            for (int i = 0; i < images.Count(); i++)
            {
                var @event = new ProductImageDeletedIntegrationEvent(images[i].Id, images[i].ProductId, images[i].ImageUrl);

                await _integrationEventService.SaveEventAndCatalogContextChangesAsync(@event);
                await _integrationEventService.PublishThroughEventBusAsync(@event);
            }

            return true;
        }

        public async Task<PaginatedResult<ProductResponse>> GetAllAsync(BaseParam param, ProductFilter productFilter)
        {
            var spec = new ProductPaginatedFilteredSpec(param, productFilter);
            var products = await _productRepository.ListAsync(spec);
            var totalRecords = await _productRepository.CountAsync(new ProductFilteredSpec(productFilter));
            var productsResponse = _mapper.Map<IEnumerable<ProductResponse>>(products);
            return new PaginatedResult<ProductResponse>(param.PageIndex, param.PageSize, totalRecords, productsResponse);
        }

        public async Task<ProductResponse> GetByIdAsync(int productId)
        {
            var product = await _productRepository.FirstOrDefaultAsync(new ProductByIdSpec(productId));
            if (product is null) throw new ArgumentException($"Can not find product with key: {productId}");
            var result = _mapper.Map<ProductResponse>(product);
            return result;
        }

        public async Task<IEnumerable<ProductResponse>> GetByIdsAsync(string productIds)
        {
            var spec = new ProductByIdsSpec(productIds);
            var products = await _productRepository.ListAsync(spec);
            var productsResponse = _mapper.Map<IEnumerable<ProductResponse>>(products);
            return productsResponse;
        }

        public async Task<List<ProductByCategory>> GetProductByCategoryAsync()
        {
            var result = await _productRepository.GroupBy(od => od.Category.CategoryName)
               .Select(group => new ProductByCategory
               {
                   CategoryName = group.Key,
                   ProductIds = group.Select(x => x.Id).ToList(),
               }).ToListAsync();

            return result;
        }

        public async Task<IEnumerable<string>> GetTagsAsync()
        {
            var blogTags = await _productRepository.ListAsync(new ProductTagsSpec());
            var result = blogTags.SelectMany(x => x).Distinct();
            return result;
        }

        public async Task<int> GetTotalProductsAsync()
        {
            var result = await _productRepository.CountAsync();
            return result;
        }

        public async Task<ProductResponse> UpdateAsync(ProductUpdateRequest request)
        {
            var product = await _productRepository.FirstOrDefaultAsync(new ProductByIdSpec(request.Id));
            if (product is null) throw new ArgumentException($"Can not find product with key: {request.Id}");

            product.ProductName = request.ProductName ?? product.ProductName;
            product.Price = request.Price;
            product.Tags = request.Tags;
            product.CategoryId = request.CategoryId;
            product.BrandId = request.BrandId;

            List<ProductImage> images = new List<ProductImage>();


            product.ProductColors = request.ProductColors.Select(x => new ProductColor()
            {
                ColorId = x.ColorId,
                ProductId = request.Id
            }).ToList();

            product.ProductSizes = request.ProductSizes.Select(x => new ProductSize()
            {
                SizeId = x.SizeId,
                ProductId = request.Id
            }).ToList();

            await _productImageRepository.AddRangeAsync(images);

            await _productRepository.UpdateAsync(product);
            await _productRepository.SaveChangesAsync();

            return _mapper.Map<ProductResponse>(product);
        }
    }
}
