using AutoMapper;
using EventBus.Abstractions;
using Inventory.API.DTOs.WarehouseEntries;
using Inventory.API.IntegrationEvents.Events;
using Inventory.API.Interfaces;

namespace Inventory.API.IntegrationEvents.EventHandling;

public class OrderCreatedIntegrationEventHandler : IIntegrationEventHandler<OrderCreatedIntegrationEvent>
{
    private readonly ILogger<OrderCreatedIntegrationEventHandler> _logger;
    private readonly IWarehouseEntryService _warehouseEntryService;
    private readonly IMapper _mapper;
    public OrderCreatedIntegrationEventHandler(
        ILogger<OrderCreatedIntegrationEventHandler> logger,
        IMapper mapper,
        IWarehouseEntryService warehouseEntryService)
    {
        _warehouseEntryService = warehouseEntryService;
        _mapper = mapper;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task Handle(OrderCreatedIntegrationEvent @event)
    {
        _logger.LogInformation("----- Handling integration event: {IntegrationEventId} at {AppName} - ({@IntegrationEvent})", @event.Id, Program.AppName, @event);

        List<WarehouseEntryCreateRequest> warehouseEntries = new List<WarehouseEntryCreateRequest>();
        foreach (var orderItem in @event.OrderDetails)
        {
            var warehouseEntryCreateRequest = _mapper.Map<WarehouseEntryCreateRequest>(orderItem);
            warehouseEntryCreateRequest.SourceDocument = Models.Enums.WarehouseEntrySourceDocument.SalesOrder;
            warehouseEntryCreateRequest.SourceNo = @event.OrderId;
            warehouseEntryCreateRequest.SourceLineNo = orderItem.Id;
            warehouseEntryCreateRequest.Quantity = -orderItem.Quantity;
            warehouseEntryCreateRequest.RegisteringDate = @event.OrderDate;
            warehouseEntries.Add(warehouseEntryCreateRequest);
        }

        await _warehouseEntryService.CreateAsync(warehouseEntries);
    }
}