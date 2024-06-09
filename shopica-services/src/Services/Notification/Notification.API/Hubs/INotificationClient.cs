using Notification.API.DTOs.Notifications;

namespace Notification.API.Hubs
{
    public interface INotificationClient
    {
        Task AdminNotificationCreatedMessage(NotificationResponse notification);
        Task ClientNotificationCreatedMessage(NotificationResponse notification);
    }
}
