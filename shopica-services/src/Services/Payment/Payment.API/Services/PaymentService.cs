using AutoMapper;
using Payment.API.DTOs;
using Payment.API.DTOs.Payments;
using Payment.API.Infrastructure;
using Payment.API.Interfaces;
using Payment.API.Specifications.Payments;

namespace Payment.API.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository<Models.Payment> _paymentRepository;
        private readonly IMapper _mapper;
        public PaymentService(
           IPaymentRepository<Models.Payment> paymentRepository,
            IMapper mapper)
        {
            _paymentRepository = paymentRepository;
            _mapper = mapper;
        }
        public async Task<PaymentResponse> AddAsync(PaymentCreateRequest request)
        {
            var payment = _mapper.Map<Models.Payment>(request);

            await _paymentRepository.AddAsync(payment);
            await _paymentRepository.SaveChangesAsync();
            return _mapper.Map<PaymentResponse>(payment);
        }

        public async Task<PaginatedResult<PaymentResponse>> GetAllAsync(BaseParam param)
        {
            var spec = new PaymentPaginatedFilteredSpec(param);
            var payments = await _paymentRepository.ListAsync(spec);
            var totalRecords = await _paymentRepository.CountAsync(new PaymentFilteredSpec());
            var paymentsResponse = _mapper.Map<IEnumerable<PaymentResponse>>(payments);
            return new PaginatedResult<PaymentResponse>(param.PageIndex, param.PageSize, totalRecords, paymentsResponse);
        }

        public async Task<PaymentResponse> GetByIdAsync(int paymentId)
        {
            var order = await _paymentRepository.FirstOrDefaultAsync(new PaymentByIdSpec(paymentId));
            if (order is null) throw new ArgumentException($"Can not find payment with key: {paymentId}");
            var result = _mapper.Map<PaymentResponse>(order);
            return result;
        }
    }
}
