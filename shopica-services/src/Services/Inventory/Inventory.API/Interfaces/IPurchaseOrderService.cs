using Inventory.API.DTOs.PurchaseOrders;

namespace Inventory.API.Interfaces
{
    public interface IPurchaseOrderService
    {
        public Task<PaginatedResult<PurchaseOrderResponse>> GetAllAsync(BaseParam param, string? status);
        public Task<PurchaseOrderResponse> GetByIdAsync(int orderId);
        public Task<PurchaseOrderResponse> CreateAsync(PurchaseOrderCreateRequest request);
        public Task<PurchaseOrderResponse> UpdateAsync(PurchaseOrderUpdateRequest request);
    }
}
