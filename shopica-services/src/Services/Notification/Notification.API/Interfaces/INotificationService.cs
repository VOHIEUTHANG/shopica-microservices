using Notification.API.DTOs;
using Notification.API.DTOs.Notifications;

namespace Notification.API.Interfaces
{
    public interface INotificationService
    {
        public Task<NotificationResponse> CreateAsync(NotificationCreateRequest request);
        public Task<NotificationResponse> GetByIdAsync(string id);
        public Task<PaginatedResult<NotificationResponse>> GetAllAsync(BaseParam param, string sourceEvents);
        public Task<NotificationResponse> UpdateAsync(NotificationUpdateRequest request);
        public Task<bool> UpdateReadNotificationAsync();
        public Task<bool> DeleteAsync(string id);
    }
}
