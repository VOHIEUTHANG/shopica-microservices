namespace EventBus;


public class SubscriptionInfo
{
    public Type HandlerType { get; }
    public Type EventType { get; set; }

    public SubscriptionInfo(Type eventType, Type handlerType)
    {
        EventType = eventType;
        HandlerType = handlerType;
    }
}
