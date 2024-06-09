using EventBus.Abstractions;
using Storage.API.IntegrationEvents.Events;
using Storage.API.Interfaces;
using System.Web;

namespace Storage.API.IntegrationEvents.EventHandling;

public class CategoryDeletedIntegrationEventHandler : IIntegrationEventHandler<CategoryDeletedIntegrationEvent>
{
    private readonly ILogger<CategoryDeletedIntegrationEventHandler> _logger;
    private readonly IAwsS3Service _awsS3Service;
    public CategoryDeletedIntegrationEventHandler(
        ILogger<CategoryDeletedIntegrationEventHandler> logger,
        IAwsS3Service awsS3Service
)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _awsS3Service = awsS3Service;
    }

    public async Task Handle(CategoryDeletedIntegrationEvent @event)
    {
        _logger.LogInformation("----- Handling integration event: {IntegrationEventId} at {AppName} - ({@IntegrationEvent})", @event.Id, Program.AppName, @event);

        if (!string.IsNullOrEmpty(@event.ImageUrl))
        {
            Uri imageUri = new Uri(@event.ImageUrl);
            var key = HttpUtility.UrlDecode(imageUri.AbsolutePath.Remove(0, 1));

            await _awsS3Service.DeleteS3FileAsync(key);
        }
    }
}