using AutoMapper;
using Inventory.API.DTOs.WarehouseEntries;
using Inventory.API.Interfaces;
using Inventory.API.Specifications.WarehouseEntries;

namespace Inventory.API.Services
{
    public class WarehouseEntryService : IWarehouseEntryService
    {
        private readonly IInventoryRepository<WarehouseEntry> _warehouseRepository;
        private readonly IMapper _mapper;
        public WarehouseEntryService(IInventoryRepository<WarehouseEntry> warehouseRepository, IMapper mapper)
        {
            _warehouseRepository = warehouseRepository;
            _mapper = mapper;
        }
        public async Task<WarehouseEntryResponse> CreateAsync(WarehouseEntryCreateRequest request)
        {
            var warehouseEntry = _mapper.Map<WarehouseEntry>(request);

            await _warehouseRepository.AddAsync(warehouseEntry);
            await _warehouseRepository.SaveChangesAsync();
            return _mapper.Map<WarehouseEntryResponse>(warehouseEntry);
        }

        public async Task<List<WarehouseEntryResponse>> CreateAsync(List<WarehouseEntryCreateRequest> request)
        {
            var warehouseEntries = _mapper.Map<List<WarehouseEntry>>(request);

            await _warehouseRepository.AddRangeAsync(warehouseEntries);
            await _warehouseRepository.SaveChangesAsync();
            return _mapper.Map<List<WarehouseEntryResponse>>(warehouseEntries);
        }

        public async Task<PaginatedResult<WarehouseEntryResponse>> GetAllAsync(BaseParam param, string? documentTypes, string? productName)
        {
            var spec = new WEPaginatedFilteredSpec(param, documentTypes, productName);
            var warehouseEntries = await _warehouseRepository.ListAsync(spec);
            var totalRecords = await _warehouseRepository.CountAsync(new WEFilteredSpec(documentTypes, productName));
            var warehouseEntriesResponse = _mapper.Map<IEnumerable<WarehouseEntryResponse>>(warehouseEntries);
            return new PaginatedResult<WarehouseEntryResponse>(param.PageIndex, param.PageSize, totalRecords, warehouseEntriesResponse);
        }

        public async Task<int> GetAvailableQuantityAsync(int productId, int colorId, int sizeId)
        {
            var quantityAvailable = await _warehouseRepository.SumAsync(new WEByProductSpec(productId, colorId, sizeId), w => w.Quantity);
            return quantityAvailable;
        }
    }
}
