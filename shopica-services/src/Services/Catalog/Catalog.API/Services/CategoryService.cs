using AutoMapper;
using Catalog.API.DTOs;
using Catalog.API.DTOs.Categories;
using Catalog.API.Infrastructure;
using Catalog.API.IntegrationEvents.Events;
using Catalog.API.Interfaces;
using Catalog.API.Models;
using Catalog.API.Specifications.Categories;

namespace Catalog.API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICatalogRepository<Category> _categoryRepository;
        private readonly ICatalogIntegrationEventService _integrationEventService;
        private readonly IMapper _mapper;
        public CategoryService(
           ICatalogRepository<Category> categoryRepository,
           ICatalogIntegrationEventService integrationEventService,
            IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _integrationEventService = integrationEventService;
            _mapper = mapper;
        }
        public async Task<CategoryResponse> CreateAsync(CategoryCreateRequest request)
        {
            var categoryExist = await _categoryRepository.FirstOrDefaultAsync(new CategoryByNameSpec(request.CategoryName));
            if (categoryExist is not null) throw new ArgumentException("Category name is already exist!");

            var category = _mapper.Map<Category>(request);

            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync();
            return _mapper.Map<CategoryResponse>(category);
        }

        public async Task<bool> DeleteAsync(int categoryId)
        {
            var category = await _categoryRepository.FirstOrDefaultAsync(new CategoryByIdSpec(categoryId));
            if (category is null) throw new ArgumentException($"Can not find category with key: {categoryId}");

            await _categoryRepository.DeleteAsync(category);

            var @event = new CategoryDeletedIntegrationEvent(category.Id, category.CategoryName, category.ImageUrl);

            await _integrationEventService.SaveEventAndCatalogContextChangesAsync(@event);
            await _integrationEventService.PublishThroughEventBusAsync(@event);
            return true;
        }

        public async Task<PaginatedResult<CategoryResponse>> GetAllAsync(BaseParam param, string? name)
        {
            var spec = new CategoryPaginatedFilteredSpec(param, name);
            var categories = await _categoryRepository.ListAsync(spec);
            var totalRecords = await _categoryRepository.CountAsync(new CategoryFilteredSpec(name));
            var categoriesResponse = _mapper.Map<IEnumerable<CategoryResponse>>(categories);
            return new PaginatedResult<CategoryResponse>(param.PageIndex, param.PageSize, totalRecords, categoriesResponse);
        }

        public async Task<CategoryResponse> GetByIdAsync(int categoryId)
        {
            var category = await _categoryRepository.FirstOrDefaultAsync(new CategoryByIdSpec(categoryId));
            if (category is null) throw new ArgumentException($"Can not find category with key: {categoryId}");
            var result = _mapper.Map<CategoryResponse>(category);
            return result;
        }

        public async Task<CategoryResponse> UpdateAsync(CategoryUpdateRequest request)
        {
            var category = await _categoryRepository.FirstOrDefaultAsync(new CategoryByIdSpec(request.Id));
            if (category is null) throw new ArgumentException($"Can not find category with key: {request.Id}");

            category.CategoryName = request.CategoryName ?? category.CategoryName;
            category.ImageUrl = request.ImageUrl ?? category.ImageUrl;

            await _categoryRepository.UpdateAsync(category);
            await _categoryRepository.SaveChangesAsync();

            return _mapper.Map<CategoryResponse>(category);
        }
    }
}
