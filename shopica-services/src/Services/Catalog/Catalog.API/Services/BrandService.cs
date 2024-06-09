using AutoMapper;
using Catalog.API.DTOs;
using Catalog.API.DTOs.Brands;
using Catalog.API.Infrastructure;
using Catalog.API.Interfaces;
using Catalog.API.Models;
using Catalog.API.Specifications.Brands;

namespace Catalog.API.Services
{
    public class BrandService : IBrandService
    {
        private readonly ICatalogRepository<Brand> _brandRepository;
        private readonly IMapper _mapper;
        public BrandService(
           ICatalogRepository<Brand> brandRepository,
           IMapper mapper)
        {
            _brandRepository = brandRepository;
            _mapper = mapper;
        }
        public async Task<BrandResponse> CreateAsync(BrandCreateRequest request)
        {
            var brandExists = await _brandRepository.FirstOrDefaultAsync(new BrandByNameSpec(request.BrandName));
            if (brandExists is not null) throw new ArgumentException("Brand name is already exist!");

            var brand = _mapper.Map<Brand>(request);

            await _brandRepository.AddAsync(brand);
            await _brandRepository.SaveChangesAsync();
            return _mapper.Map<BrandResponse>(brand);
        }

        public async Task<bool> DeleteAsync(int brandId)
        {
            var brand = await _brandRepository.FirstOrDefaultAsync(new BrandByIdSpec(brandId));
            if (brand is null) throw new ArgumentException($"Can not find brand with key: {brandId}");

            await _brandRepository.DeleteAsync(brand);
            await _brandRepository.SaveChangesAsync();
            return true;
        }

        public async Task<PaginatedResult<BrandResponse>> GetAllAsync(BaseParam param, string? brandName)
        {
            var spec = new BrandPaginatedFilteredSpec(param, brandName);
            var brands = await _brandRepository.ListAsync(spec);
            var totalRecords = await _brandRepository.CountAsync(new BrandFilteredSpec(brandName));
            var brandsResponse = _mapper.Map<IEnumerable<BrandResponse>>(brands);
            return new PaginatedResult<BrandResponse>(param.PageIndex, param.PageSize, totalRecords, brandsResponse);
        }

        public async Task<BrandResponse> GetByIdAsync(int brandId)
        {
            var brand = await _brandRepository.FirstOrDefaultAsync(new BrandByIdSpec(brandId));
            if (brand is null) throw new ArgumentException($"Can not find brand with key: {brandId}");
            var result = _mapper.Map<BrandResponse>(brand);
            return result;
        }

        public async Task<BrandResponse> UpdateAsync(BrandUpdateRequest request)
        {
            var brand = await _brandRepository.FirstOrDefaultAsync(new BrandByIdSpec(request.Id));
            if (brand is null) throw new ArgumentException($"Can not find brand with key: {request.Id}");

            brand.BrandName = request.BrandName ?? brand.BrandName;

            await _brandRepository.UpdateAsync(brand);
            await _brandRepository.SaveChangesAsync();

            return _mapper.Map<BrandResponse>(brand);
        }
    }
}
