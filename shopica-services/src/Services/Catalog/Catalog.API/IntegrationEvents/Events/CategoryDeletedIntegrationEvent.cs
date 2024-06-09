using EventBus.Events;

namespace Catalog.API.IntegrationEvents.Events;

// Integration Events notes:
// An Event is "something that has happened in the past", therefore its name has to be
// An Integration Event is an event that can cause side effects to other microservices, Bounded-Contexts or external systems.
public record CategoryDeletedIntegrationEvent : IntegrationEvent
{
    public int Id { get; private init; }
    public string Name { get; private init; }
    public string ImageUrl { get; private init; }

    public CategoryDeletedIntegrationEvent(int id, string name, string imageUrl)
    {
        Id = id;
        Name = name;
        ImageUrl = imageUrl;
    }
}
