using AutoMapper;
using Payment.API.DTOs.PaymentMethods;
using Payment.API.DTOs.Payments;
using Payment.API.DTOs.Transactions;
using Payment.API.Models;

namespace Payment.API
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            DestinationMemberNamingConvention = new ExactMatchNamingConvention();

            CreateMap<PaymentMethod, PaymentMethodResponse>();
            CreateMap<PaymentMethodCreateRequest, PaymentMethod>();

            CreateMap<Models.Payment, PaymentResponse>()
                .ForMember(dest => dest.MethodName, opt => opt.MapFrom(i => i.PaymentMethod.Name));
            CreateMap<PaymentCreateRequest, Models.Payment>();

            CreateMap<Transaction, TransactionResponse>();
            CreateMap<TransactionCreateRequest, Transaction>();
        }
    }
}
