using AutoMapper;
using Ordering.API.DTOs.Addresses;
using Ordering.API.DTOs.OrderDetails;
using Ordering.API.DTOs.Orders;
using Ordering.API.IntegrationEvents.Events;
using Ordering.API.Models;

namespace Ordering.API
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            DestinationMemberNamingConvention = new ExactMatchNamingConvention();

            CreateMap<Order, OrderResponse>();
            CreateMap<OrderCreateRequest, Order>();

            CreateMap<OrderDetail, OrderDetailResponse>();
            CreateMap<OrderDetail, OrderDetailIntegrationEvent>();
            CreateMap<OrderDetailCreateRequest, OrderDetail>();

            CreateMap<Address, AddressResponse>();
            CreateMap<OrderCreateRequest, Address>();
            CreateMap<AddressCreateRequest, Address>();
        }
    }
}
