using EventBus.Events;

namespace Notification.API.IntegrationEvents.Events
{
    public record OrderCreatedIntegrationEvent : IntegrationEvent
    {
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderDetailIntegrationEvent> OrderDetails { get; set; }
        public OrderCreatedIntegrationEvent(int orderId, int customerId, string customerName, DateTime orderDate, decimal totalPrice, List<OrderDetailIntegrationEvent> orderDetails)
        {
            OrderId = orderId;
            CustomerId = customerId;
            CustomerName = customerName;
            TotalPrice = totalPrice;
            OrderDate = orderDate;
            OrderDetails = orderDetails;
        }
    }
    public class OrderDetailIntegrationEvent
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string ProductName { get; set; }
        public int SizeId { get; set; }
        public int ColorId { get; set; }
        public string ColorName { get; set; }
        public string SizeName { get; set; }
        public string ImageUrl { get; set; }
    }
}
