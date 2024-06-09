using EventBus.Events;

namespace Catalog.API.IntegrationEvents.Events
{
    public record ProductCreatedIntegrationEvent : IntegrationEvent
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ImageUrl { get; set; }
        public ProductCreatedIntegrationEvent(int productId, string productName, string imageUrl)
        {
            this.ProductId = productId;
            this.ProductName = productName;
            this.ImageUrl = imageUrl;
        }
    }
}
