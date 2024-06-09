using EventBus.Events;

namespace Storage.API.IntegrationEvents.Events
{
    public record ProductImageDeletedIntegrationEvent : IntegrationEvent
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ImageUrl { get; set; }

        public ProductImageDeletedIntegrationEvent(int id, int productId, string imageUrl)
        {
            Id = id;
            ProductId = productId;
            ImageUrl = imageUrl;
        }
    }
}
