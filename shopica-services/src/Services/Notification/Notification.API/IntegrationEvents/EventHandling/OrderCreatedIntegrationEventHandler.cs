using EventBus.Abstractions;
using Microsoft.AspNetCore.SignalR;
using Notification.API.DTOs.Notifications;
using Notification.API.Hubs;
using Notification.API.IntegrationEvents.Events;
using Notification.API.Interfaces;
using Notification.API.Models.Enums;

namespace Notification.API.IntegrationEvents.EventHandling;

public class OrderCreatedIntegrationEventHandler : IIntegrationEventHandler<OrderCreatedIntegrationEvent>
{
    private readonly ILogger<OrderCreatedIntegrationEventHandler> _logger;
    private readonly IHubContext<NotificationHub, INotificationClient> _hubContext;
    private readonly INotificationService _notificationService;
    public OrderCreatedIntegrationEventHandler(
        ILogger<OrderCreatedIntegrationEventHandler> logger,
       IHubContext<NotificationHub, INotificationClient> hubContext,
       INotificationService notificationService)
    {
        _hubContext = hubContext;
        _notificationService = notificationService;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task Handle(OrderCreatedIntegrationEvent @event)
    {
        _logger.LogInformation("----- Handling integration event: {IntegrationEventId} at {AppName} - ({@IntegrationEvent})", @event.Id, Program.AppName, @event);

        var notification = new NotificationCreateRequest()
        {
            Content = $"Customer {@event.CustomerName} just created an order",
            SenderId = @event.CustomerId,
            SourceEvent = NotificationSourceEvent.OrderCreated,
            RecipientId = 1,
            SourceDocumentId = @event.OrderId.ToString()
        };

        var result = await _notificationService.CreateAsync(notification);

        await _hubContext.Clients.All.AdminNotificationCreatedMessage(result);
    }
}