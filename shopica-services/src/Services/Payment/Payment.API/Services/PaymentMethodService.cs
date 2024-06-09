using AutoMapper;
using Payment.API.DTOs;
using Payment.API.DTOs.PaymentMethods;
using Payment.API.Infrastructure;
using Payment.API.Interfaces;
using Payment.API.Models;
using Payment.API.Specifications.PaymentMethods;

namespace Payment.API.Services
{
    public class PaymentMethodService : IPaymentMethodService
    {
        private readonly IPaymentRepository<PaymentMethod> _paymentMethodRepository;
        private readonly IMapper _mapper;
        public PaymentMethodService(
           IPaymentRepository<PaymentMethod> paymentMethodRepository,
            IMapper mapper)
        {
            _paymentMethodRepository = paymentMethodRepository;
            _mapper = mapper;
        }
        public async Task<PaymentMethodResponse> AddAsync(PaymentMethodCreateRequest request)
        {
            var paymentMethodExists = await _paymentMethodRepository.FirstOrDefaultAsync(new PaymentMethodByNameSpec(request.Name));
            if (paymentMethodExists is not null) throw new ArgumentException("Payment method name is already exist!");

            var paymentMethod = _mapper.Map<PaymentMethod>(request);

            await _paymentMethodRepository.AddAsync(paymentMethod);
            await _paymentMethodRepository.SaveChangesAsync();
            return _mapper.Map<PaymentMethodResponse>(paymentMethod);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var paymentMethodExists = await _paymentMethodRepository.FirstOrDefaultAsync(new PaymentMethodByIdSpec(id));
            if (paymentMethodExists is null) throw new ArgumentException("Payment method id is not already exist!");

            await _paymentMethodRepository.DeleteAsync(paymentMethodExists);
            await _paymentMethodRepository.SaveChangesAsync();
            return true;
        }

        public async Task<PaginatedResult<PaymentMethodResponse>> GetAllAsync(BaseParam param, string? name)
        {
            var spec = new PaymentMethodPaginatedFilteredSpec(param, name);
            var paymentMethods = await _paymentMethodRepository.ListAsync(spec);
            var totalRecords = await _paymentMethodRepository.CountAsync(new PaymentMethodFilteredSpec(name));
            var brandsResponse = _mapper.Map<IEnumerable<PaymentMethodResponse>>(paymentMethods);
            return new PaginatedResult<PaymentMethodResponse>(param.PageIndex, param.PageSize, totalRecords, brandsResponse);
        }

        public async Task<PaymentMethodResponse> GetByIdAsync(int id)
        {
            var paymentMethod = await _paymentMethodRepository.FirstOrDefaultAsync(new PaymentMethodByIdSpec(id));
            if (paymentMethod is null) throw new ArgumentException($"Can not find payment method with key: {id}");
            var result = _mapper.Map<PaymentMethodResponse>(paymentMethod);
            return result;
        }

        public async Task<PaymentMethodResponse> UpdateAsync(PaymentMethodUpdateRequest request)
        {
            var paymentMethod = await _paymentMethodRepository.FirstOrDefaultAsync(new PaymentMethodByIdSpec(request.Id));
            if (paymentMethod is null) throw new ArgumentException($"Can not find payment method with key: {request.Id}");

            paymentMethod.Name = request.Name ?? paymentMethod.Name;
            paymentMethod.Description = request.Description ?? paymentMethod.Description;
            paymentMethod.ImageUrl = request.ImageUrl ?? paymentMethod.ImageUrl;
            paymentMethod.Active = request.Active;

            await _paymentMethodRepository.UpdateAsync(paymentMethod);
            await _paymentMethodRepository.SaveChangesAsync();

            return _mapper.Map<PaymentMethodResponse>(paymentMethod);
        }
    }
}
