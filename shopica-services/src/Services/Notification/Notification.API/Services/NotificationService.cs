using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Driver;
using Notification.API.DTOs;
using Notification.API.DTOs.Notifications;
using Notification.API.Infrastructure.Data;
using Notification.API.Interfaces;
using Notification.API.Models.Enums;

namespace Notification.API.Services
{
    public class NotificationService : INotificationService
    {
        private readonly NotificationDbContext _dbContext;
        private readonly IMapper _mapper;
        public NotificationService(
            NotificationDbContext dbContext,
            IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        public async Task<NotificationResponse> CreateAsync(NotificationCreateRequest request)
        {
            var notification = _mapper.Map<Models.Notification>(request);

            notification.Id = ObjectId.GenerateNewId().ToString();

            notification.CreatedAt = DateTime.UtcNow;

            await _dbContext.Notifications.AddAsync(notification);

            await _dbContext.SaveChangesAsync();

            return _mapper.Map<NotificationResponse>(notification);
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var notification = await _dbContext.Notifications.FirstOrDefaultAsync(n => n.Id == id);
            if (notification is null) throw new ArgumentException($"Can not find notification with key: {id}");

            _dbContext.Notifications.Remove(notification);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<PaginatedResult<NotificationResponse>> GetAllAsync(BaseParam param, string sourceEvents)
        {
            IQueryable<Models.Notification> query = Enumerable.Empty<Models.Notification>().AsQueryable();

            if (!string.IsNullOrEmpty(sourceEvents))
            {
                var sourceEventList = sourceEvents.ToLower().Split(',').Select(s => (NotificationSourceEvent)Enum.Parse(typeof(NotificationSourceEvent), s));
                query = _dbContext.Notifications.Where(d => sourceEventList.Contains(d.SourceEvent));
            }

            if (param.SortField == "id" && param.SortOrder == "descend")
            {
                query = query.OrderByDescending(d => d.Id);
            }

            var notifications = await query
             .Skip(param.PageSize * (param.PageIndex - 1))
             .Take(param.PageSize)
             .ToListAsync();

            var totalRecords = await _dbContext.Notifications.CountAsync();
            var notificationsResponse = _mapper.Map<IEnumerable<NotificationResponse>>(notifications);

            return new PaginatedResult<NotificationResponse>(param.PageIndex, param.PageSize, totalRecords, notificationsResponse);
        }

        public async Task<NotificationResponse> GetByIdAsync(string id)
        {
            var notification = await _dbContext.Notifications.FirstOrDefaultAsync(n => n.Id == id);
            if (notification is null) throw new ArgumentException($"Can not find notification with key: {id}");

            return _mapper.Map<NotificationResponse>(notification);
        }

        public async Task<NotificationResponse> UpdateAsync(NotificationUpdateRequest request)
        {
            var notification = await _dbContext.Notifications.FirstOrDefaultAsync(n => n.Id == request.Id);

            if (notification is null) throw new ArgumentException($"Can not find notification with key: {request.Id}");

            notification.Content = request.Content;
            notification.SourceEvent = request.SourceEvent;
            notification.UpdatedAt = DateTime.UtcNow;

            _dbContext.Notifications.Update(notification);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<NotificationResponse>(notification);
        }

        public async Task<bool> UpdateReadNotificationAsync()
        {
            var notifications = await _dbContext.Notifications.ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            _dbContext.Notifications.UpdateRange(notifications);

            await _dbContext.SaveChangesAsync();

            return true;
        }
    }
}
