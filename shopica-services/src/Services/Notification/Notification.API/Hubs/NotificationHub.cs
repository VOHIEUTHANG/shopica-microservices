using Microsoft.AspNetCore.SignalR;
using Notification.API.DTOs.Notifications;

namespace Notification.API.Hubs
{
    public class NotificationHub : Hub<INotificationClient>
    {
        public async Task AdminSendMessage(NotificationResponse notification)
        {
            await Clients.All.AdminNotificationCreatedMessage(notification);
        }

        public async Task ClientSendMessage(NotificationResponse notification)
        {
            await Clients.All.ClientNotificationCreatedMessage(notification);
        }
    }
}
