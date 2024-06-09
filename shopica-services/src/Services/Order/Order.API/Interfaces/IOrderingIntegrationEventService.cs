using EventBus.Events;

namespace Ordering.API.Interfaces
{
    public interface IOrderingIntegrationEventService
    {
        Task SaveEventAndOrderingContextChangesAsync(IntegrationEvent evt);
        Task PublishThroughEventBusAsync(IntegrationEvent evt);
    }
}
