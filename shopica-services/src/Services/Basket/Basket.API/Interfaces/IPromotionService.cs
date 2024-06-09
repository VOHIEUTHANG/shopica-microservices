using Basket.API.DTOs;
using Basket.API.DTOs.PromotionCalculations;
using Basket.API.DTOs.Promotions;

namespace Basket.API.Interfaces
{
    public interface IPromotionService
    {
        public Task<PaginatedResult<PromotionResponse>> GetAllAsync(BaseParam param, string? description);
        public Task<PromotionResponse> GetByIdAsync(string promotionCode);
        public Task<PromotionResponse> CreateAsync(PromotionCreateRequest request);
        public Task<PromotionResponse> UpdateAsync(PromotionUpdateRequest request);
        public Task<bool> DeleteAsync(string promotionCode);
        public Task<PromotionApplyResponse> ApplyPromotionAsync(PromotionApplyRequest request);
        public Task<PaginatedResult<PromotionResponse>> GetValidPromotionAsync(BaseParam param, PromotionApplyRequest request);
        public Task<bool> UnApplyPromotionAsync(int customerId, string promotionCode);
        public Task<bool> ChangePromotionResultWhenOrderCreatedAsync(int customerId, int orderId);
    }
}
