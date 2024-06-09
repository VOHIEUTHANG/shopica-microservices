using EventBus.Events;

namespace EventBus.Abstractions
{
    public interface IPublisher
    {
        void Publish(IntegrationEvent @event);
    }
}
