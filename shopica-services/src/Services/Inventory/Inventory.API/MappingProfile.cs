using AutoMapper;
using Inventory.API.DTOs.PurchaseOrders;
using Inventory.API.DTOs.WarehouseEntries;
using Inventory.API.IntegrationEvents.Events;

namespace Inventory.API
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            DestinationMemberNamingConvention = new ExactMatchNamingConvention();

            CreateMap<WarehouseEntry, WarehouseEntryResponse>();
            CreateMap<WarehouseEntryCreateRequest, WarehouseEntry>();
            CreateMap<OrderDetailIntegrationEvent, WarehouseEntryCreateRequest>();
            CreateMap<PurchaseOrderDetail, WarehouseEntryCreateRequest>();

            CreateMap<PurchaseOrder, PurchaseOrderResponse>();
            CreateMap<PurchaseOrderCreateRequest, PurchaseOrder>();
            CreateMap<PurchaseOrderUpdateRequest, PurchaseOrder>();

            CreateMap<PurchaseOrderDetail, PurchaseOrderDetailResponse>();
            CreateMap<PurchaseOrderDetailCreateRequest, PurchaseOrderDetail>();
            CreateMap<PurchaseOrderDetailUpdateRequest, PurchaseOrderDetail>();
        }
    }
}
