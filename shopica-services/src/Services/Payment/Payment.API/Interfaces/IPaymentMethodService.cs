using Payment.API.DTOs;
using Payment.API.DTOs.PaymentMethods;

namespace Payment.API.Interfaces
{
    public interface IPaymentMethodService
    {
        public Task<PaginatedResult<PaymentMethodResponse>> GetAllAsync(BaseParam param, string? name);
        public Task<PaymentMethodResponse> AddAsync(PaymentMethodCreateRequest request);
        public Task<PaymentMethodResponse> UpdateAsync(PaymentMethodUpdateRequest request);
        public Task<bool> DeleteAsync(int id);
        public Task<PaymentMethodResponse> GetByIdAsync(int id);
    }
}
