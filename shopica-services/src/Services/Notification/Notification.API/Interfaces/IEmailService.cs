using Notification.API.DTOs.Emails;

namespace Notification.API.Interfaces
{
    public interface IEmailService
    {
        public Task<bool> SendMailAsync(MailData mailData);
    }
}
