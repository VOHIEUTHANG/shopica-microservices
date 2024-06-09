using EventBus.Events;

namespace Identity.API.Interfaces
{
    public interface IIdentityIntegrationEventService
    {
        Task SaveEventAndIdentityContextChangesAsync(IntegrationEvent evt);
        Task PublishThroughEventBusAsync(IntegrationEvent evt);
    }
}
