using EventBus.Events;

namespace Notification.API.IntegrationEvents.Events
{
    public record ResetPasswordLinkGeneratedIntegrationEvent : IntegrationEvent
    {
        public string Email { get; set; }
        public string FullName { get; set; }
        public string ResetLink { get; set; }
        public ResetPasswordLinkGeneratedIntegrationEvent(string email, string fullName, string resetLink)
        {
            Email = email;
            FullName = fullName;
            ResetLink = resetLink;
        }
    }
}
