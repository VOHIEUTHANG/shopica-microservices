using AutoMapper;
using Inventory.API.DTOs.PurchaseOrders;
using Inventory.API.DTOs.WarehouseEntries;
using Inventory.API.Interfaces;
using Inventory.API.Specifications.PurchaseOrders;


namespace Inventory.API.Services
{
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly IInventoryRepository<PurchaseOrder> _purchaseOrdersRepository;
        private readonly IWarehouseEntryService _warehouseEntryService;
        private readonly IMapper _mapper;
        public PurchaseOrderService(
            IInventoryRepository<PurchaseOrder> purchaseOrdersRepository,
            IWarehouseEntryService warehouseEntryService,
            IMapper mapper)
        {
            _purchaseOrdersRepository = purchaseOrdersRepository;
            _warehouseEntryService = warehouseEntryService;
            _mapper = mapper;
        }
        public async Task<PurchaseOrderResponse> CreateAsync(PurchaseOrderCreateRequest request)
        {
            var purchaseOrder = _mapper.Map<PurchaseOrder>(request);

            await _purchaseOrdersRepository.AddAsync(purchaseOrder);
            await _purchaseOrdersRepository.SaveChangesAsync();

            List<WarehouseEntryCreateRequest> warehouseEntries = new List<WarehouseEntryCreateRequest>();
            foreach (var orderItem in purchaseOrder.PurchaseOrderDetails)
            {
                var warehouseEntryCreateRequest = _mapper.Map<WarehouseEntryCreateRequest>(orderItem);
                warehouseEntryCreateRequest.SourceDocument = Models.Enums.WarehouseEntrySourceDocument.PurchaseOrder;
                warehouseEntryCreateRequest.SourceNo = purchaseOrder.Id;
                warehouseEntryCreateRequest.SourceLineNo = orderItem.Id;
                warehouseEntryCreateRequest.Quantity = orderItem.Quantity;
                warehouseEntryCreateRequest.RegisteringDate = purchaseOrder.OrderDate;
                warehouseEntries.Add(warehouseEntryCreateRequest);
            }

            await _warehouseEntryService.CreateAsync(warehouseEntries);

            return _mapper.Map<PurchaseOrderResponse>(purchaseOrder);
        }

        public async Task<PaginatedResult<PurchaseOrderResponse>> GetAllAsync(BaseParam param, string? status)
        {
            var spec = new PurchaseOrderPaginatedFilteredSpec(param, status);
            var pOrders = await _purchaseOrdersRepository.ListAsync(spec);
            var totalRecords = await _purchaseOrdersRepository.CountAsync(new PurchaseOrderFilteredSpec(status));
            var ordersResponse = _mapper.Map<IEnumerable<PurchaseOrderResponse>>(pOrders);
            return new PaginatedResult<PurchaseOrderResponse>(param.PageIndex, param.PageSize, totalRecords, ordersResponse);
        }

        public async Task<PurchaseOrderResponse> GetByIdAsync(int orderId)
        {
            var pOrder = await _purchaseOrdersRepository.FirstOrDefaultAsync(new PurchaseOrderByIdSpec(orderId));
            if (pOrder is null) throw new ArgumentException($"Can not find purchase order with key: {orderId}");
            var result = _mapper.Map<PurchaseOrderResponse>(pOrder);
            return result;
        }

        public async Task<PurchaseOrderResponse> UpdateAsync(PurchaseOrderUpdateRequest request)
        {
            var pOrder = await _purchaseOrdersRepository.FirstOrDefaultAsync(new PurchaseOrderByIdSpec(request.Id));
            if (pOrder is null) throw new ArgumentException($"Can not find purchase order with key: {request.Id}");

            pOrder.Status = request.Status;

            await _purchaseOrdersRepository.UpdateAsync(pOrder);
            await _purchaseOrdersRepository.SaveChangesAsync();

            return _mapper.Map<PurchaseOrderResponse>(pOrder);
        }
    }
}
