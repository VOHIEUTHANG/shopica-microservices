using Inventory.API.DTOs.WarehouseEntries;

namespace Inventory.API.Interfaces
{
    public interface IWarehouseEntryService
    {
        public Task<PaginatedResult<WarehouseEntryResponse>> GetAllAsync(BaseParam param, string? documentTypes, string? productName);
        public Task<WarehouseEntryResponse> CreateAsync(WarehouseEntryCreateRequest request);
        public Task<List<WarehouseEntryResponse>> CreateAsync(List<WarehouseEntryCreateRequest> request);
        public Task<int> GetAvailableQuantityAsync(int productId, int colorId, int sizeId);
    }
}
