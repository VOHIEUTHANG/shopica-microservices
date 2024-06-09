using Ordering.API.DTOs;
using Ordering.API.DTOs.OrderDetails;
using Ordering.API.DTOs.Orders;

namespace Ordering.API.Interfaces
{
    public interface IOrderService
    {
        public Task<PaginatedResult<OrderResponse>> GetAllAsync(BaseParam param, int customerId, string? customerName, string? status);
        public Task<OrderResponse> GetByIdAsync(int orderId);
        public Task<OrderResponse> CreateAsync(OrderCreateRequest request);
        public Task<OrderResponse> UpdateAsync(OrderUpdateRequest request);
        public Task<List<ProductByCount>> GetBestSellerAsync();
        public Task<List<ProductByRevenues>> GetProductRevenuesAsync();
        public Task<List<ProductByColor>> GetProductByColorAsync();
        public Task<int> GetTotalSalesOrderAsync();
        public Task<decimal> GetTotalRevenuesAsync();
    }
}
