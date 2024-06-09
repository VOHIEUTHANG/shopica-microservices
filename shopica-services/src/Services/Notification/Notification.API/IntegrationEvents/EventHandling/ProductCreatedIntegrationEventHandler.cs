using EventBus.Abstractions;
using Microsoft.AspNetCore.SignalR;
using Notification.API.DTOs.Notifications;
using Notification.API.Hubs;
using Notification.API.IntegrationEvents.Events;
using Notification.API.Interfaces;
using Notification.API.Models.Enums;

namespace Notification.API.IntegrationEvents.EventHandling;

public class ProductCreatedIntegrationEventHandler : IIntegrationEventHandler<ProductCreatedIntegrationEvent>
{
    private readonly ILogger<ProductCreatedIntegrationEventHandler> _logger;
    private readonly IHubContext<NotificationHub, INotificationClient> _hubContext;
    private readonly INotificationService _notificationService;
    public ProductCreatedIntegrationEventHandler(
        ILogger<ProductCreatedIntegrationEventHandler> logger,
       IHubContext<NotificationHub, INotificationClient> hubContext,
       INotificationService notificationService)
    {
        _hubContext = hubContext;
        _notificationService = notificationService;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task Handle(ProductCreatedIntegrationEvent @event)
    {
        _logger.LogInformation("----- Handling integration event: {IntegrationEventId} at {AppName} - ({@IntegrationEvent})", @event.Id, Program.AppName, @event);

        var notification = new NotificationCreateRequest()
        {
            Content = $"{@event.ProductName} just be created",
            SourceEvent = NotificationSourceEvent.ProductCreated,
            RecipientId = 1,
            Attribute1 = @event.ImageUrl,
            SourceDocumentId = @event.ProductId.ToString()
        };

        var result = await _notificationService.CreateAsync(notification);

        await _hubContext.Clients.All.ClientNotificationCreatedMessage(result);
    }
}