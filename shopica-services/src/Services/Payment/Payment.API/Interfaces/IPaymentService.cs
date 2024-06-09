using Payment.API.DTOs;
using Payment.API.DTOs.Payments;

namespace Payment.API.Interfaces
{
    public interface IPaymentService
    {
        public Task<PaginatedResult<PaymentResponse>> GetAllAsync(BaseParam param);
        public Task<PaymentResponse> GetByIdAsync(int paymentId);
        public Task<PaymentResponse> AddAsync(PaymentCreateRequest request);
    }
}
