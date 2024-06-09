using EventBus.Abstractions;
using EventBus.Events;

namespace EventBus;

public interface IEventBusSubscriptionsManager
{
    bool IsEmpty { get; }
    event EventHandler<string> OnEventRemoved;

    void AddSubscription<T, TH>()
        where T : IntegrationEvent
        where TH : IIntegrationEventHandler<T>;

    void RemoveSubscription<T, TH>()
            where TH : IIntegrationEventHandler<T>
            where T : IntegrationEvent;

    bool HasSubscriptionsForEvent(string eventName);
    void Clear();
    IEnumerable<SubscriptionInfo> GetHandlersForEvent(string eventName);
}
