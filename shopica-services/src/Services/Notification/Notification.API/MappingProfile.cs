using AutoMapper;
using Notification.API.DTOs.Notifications;

namespace Notification.API
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            DestinationMemberNamingConvention = new ExactMatchNamingConvention();

            CreateMap<Models.Notification, NotificationResponse>();
            CreateMap<NotificationCreateRequest, Models.Notification>();

        }
    }
}
