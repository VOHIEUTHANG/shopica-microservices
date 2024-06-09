using AutoMapper;
using Catalog.API.DTOs;
using Catalog.API.DTOs.Colors;
using Catalog.API.Infrastructure;
using Catalog.API.Interfaces;
using Catalog.API.Models;
using Catalog.API.Specifications.Colors;

namespace Catalog.API.Services
{
    public class ColorService : IColorService
    {
        private readonly ICatalogRepository<Color> _colorRepository;
        private readonly IMapper _mapper;
        public ColorService(
           ICatalogRepository<Color> colorRepository,
            IMapper mapper)
        {
            _colorRepository = colorRepository;
            _mapper = mapper;
        }
        public async Task<ColorResponse> CreateAsync(ColorCreateRequest request)
        {
            var colorExist = await _colorRepository.FirstOrDefaultAsync(new ColorByCodeSpec(request.ColorCode));
            if (colorExist is not null) throw new ArgumentException("Color code is already exist!");

            var color = _mapper.Map<Color>(request);

            await _colorRepository.AddAsync(color);
            await _colorRepository.SaveChangesAsync();
            return _mapper.Map<ColorResponse>(color);
        }

        public async Task<bool> DeleteAsync(int colorId)
        {
            var color = await _colorRepository.FirstOrDefaultAsync(new ColorByIdSpec(colorId));
            if (color is null) throw new ArgumentException($"Can not find color with key: {colorId}");

            await _colorRepository.DeleteAsync(color);
            await _colorRepository.SaveChangesAsync();
            return true;
        }

        public async Task<PaginatedResult<ColorResponse>> GetAllAsync(BaseParam param, string? colorName)
        {
            var spec = new ColorPaginatedFilteredSpec(param, colorName);
            var colors = await _colorRepository.ListAsync(spec);
            var totalRecords = await _colorRepository.CountAsync(new ColorFilteredSpec(colorName));
            var colorsResponse = _mapper.Map<IEnumerable<ColorResponse>>(colors);
            return new PaginatedResult<ColorResponse>(param.PageIndex, param.PageSize, totalRecords, colorsResponse);
        }

        public async Task<ColorResponse> GetByIdAsync(int colorId)
        {
            var color = await _colorRepository.FirstOrDefaultAsync(new ColorByIdSpec(colorId));
            if (color is null) throw new ArgumentException($"Can not find color with key: {colorId}");
            var result = _mapper.Map<ColorResponse>(color);
            return result;
        }

        public async Task<ColorResponse> UpdateAsync(ColorUpdateRequest request)
        {
            var color = await _colorRepository.FirstOrDefaultAsync(new ColorByIdSpec(request.Id));
            if (color is null) throw new ArgumentException($"Can not find color with key: {request.Id}");

            color.ColorCode = request.ColorCode ?? color.ColorCode;
            color.ColorName = request.ColorName ?? color.ColorName;

            await _colorRepository.UpdateAsync(color);
            await _colorRepository.SaveChangesAsync();

            return _mapper.Map<ColorResponse>(color);
        }
    }
}
