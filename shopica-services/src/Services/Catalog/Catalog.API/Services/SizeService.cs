using AutoMapper;
using Catalog.API.DTOs;
using Catalog.API.DTOs.Sizes;
using Catalog.API.Infrastructure;
using Catalog.API.Interfaces;
using Catalog.API.Models;
using Catalog.API.Specifications.Sizes;

namespace Catalog.API.Services
{
    public class SizeService : ISizeService
    {
        private readonly ICatalogRepository<Size> _sizeRepository;
        private readonly IMapper _mapper;
        public SizeService(
           ICatalogRepository<Size> sizeRepository,
            IMapper mapper)
        {
            _sizeRepository = sizeRepository;
            _mapper = mapper;
        }
        public async Task<SizeResponse> CreateAsync(SizeCreateRequest request)
        {
            var sizeExists = await _sizeRepository.FirstOrDefaultAsync(new SizeByNameSpec(request.SizeName));
            if (sizeExists is not null) throw new ArgumentException("Size name is already exist!");

            var size = _mapper.Map<Size>(request);

            await _sizeRepository.AddAsync(size);
            await _sizeRepository.SaveChangesAsync();
            return _mapper.Map<SizeResponse>(size);
        }

        public async Task<bool> DeleteAsync(int sizeId)
        {
            var size = await _sizeRepository.FirstOrDefaultAsync(new SizeByIdSpec(sizeId));
            if (size is null) throw new ArgumentException($"Can not find size with key: {sizeId}");

            await _sizeRepository.DeleteAsync(size);
            await _sizeRepository.SaveChangesAsync();
            return true;
        }

        public async Task<PaginatedResult<SizeResponse>> GetAllAsync(BaseParam param, string? sizeName)
        {
            var spec = new SizePaginatedFilteredSpec(param, sizeName);
            var sizes = await _sizeRepository.ListAsync(spec);
            var totalRecords = await _sizeRepository.CountAsync(new SizeFilteredSpec(sizeName));
            var sizesResponse = _mapper.Map<IEnumerable<SizeResponse>>(sizes);
            return new PaginatedResult<SizeResponse>(param.PageIndex, param.PageSize, totalRecords, sizesResponse);
        }

        public async Task<SizeResponse> GetByIdAsync(int sizeId)
        {
            var size = await _sizeRepository.FirstOrDefaultAsync(new SizeByIdSpec(sizeId));
            if (size is null) throw new ArgumentException($"Can not find size with key: {sizeId}");
            var result = _mapper.Map<SizeResponse>(size);
            return result;
        }

        public async Task<SizeResponse> UpdateAsync(SizeUpdateRequest request)
        {
            var size = await _sizeRepository.FirstOrDefaultAsync(new SizeByIdSpec(request.Id));
            if (size is null) throw new ArgumentException($"Can not find size with key: {request.Id}");

            size.SizeName = request.SizeName ?? size.SizeName;

            await _sizeRepository.UpdateAsync(size);
            await _sizeRepository.SaveChangesAsync();

            return _mapper.Map<SizeResponse>(size);
        }
    }
}
