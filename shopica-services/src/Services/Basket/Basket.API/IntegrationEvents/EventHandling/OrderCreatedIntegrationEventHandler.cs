using Basket.API.IntegrationEvents.Events;
using Basket.API.Interfaces;
using EventBus.Abstractions;

namespace Basket.API.IntegrationEvents.EventHandling;

public class OrderCreatedIntegrationEventHandler : IIntegrationEventHandler<OrderCreatedIntegrationEvent>
{
    private readonly ILogger<OrderCreatedIntegrationEventHandler> _logger;
    private readonly ICartService _cartService;
    private readonly IPromotionService _promotionService;
    public OrderCreatedIntegrationEventHandler(
        ILogger<OrderCreatedIntegrationEventHandler> logger,
        ICartService cartService,
        IPromotionService promotionService)
    {
        _cartService = cartService;
        _promotionService = promotionService;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task Handle(OrderCreatedIntegrationEvent @event)
    {
        _logger.LogInformation("----- Handling integration event: {IntegrationEventId} at {AppName} - ({@IntegrationEvent})", @event.Id, Program.AppName, @event);

        await _promotionService.ChangePromotionResultWhenOrderCreatedAsync(@event.CustomerId, @event.OrderId);

        await _cartService.EmptyCartAsync(@event.CustomerId);
    }
}