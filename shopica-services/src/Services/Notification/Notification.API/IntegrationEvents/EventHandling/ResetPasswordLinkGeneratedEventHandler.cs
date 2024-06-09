using EventBus.Abstractions;
using Notification.API.DTOs.Emails;
using Notification.API.IntegrationEvents.Events;
using Notification.API.Interfaces;

namespace Notification.API.IntegrationEvents.EventHandling
{
    public class ResetPasswordLinkGeneratedEventHandler : IIntegrationEventHandler<ResetPasswordLinkGeneratedIntegrationEvent>
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<ResetPasswordLinkGeneratedEventHandler> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ResetPasswordLinkGeneratedEventHandler(
            IEmailService emailService,
            IWebHostEnvironment webHostEnvironment,
            ILogger<ResetPasswordLinkGeneratedEventHandler> logger)
        {
            _emailService = emailService;
            _webHostEnvironment = webHostEnvironment;
            _logger = logger;
        }

        public async Task Handle(ResetPasswordLinkGeneratedIntegrationEvent @event)
        {
            _logger.LogInformation("----- Handling integration event: {IntegrationEventId} at {AppName} - ({@IntegrationEvent})", @event.Id, Program.AppName, @event);

            string contentTemplate = GetStringFromHtml(_webHostEnvironment.WebRootPath, "ResetPassword.html");

            var mailData = new MailData()
            {
                EmailToId = @event.Email,
                EmailSubject = $"Password Reset",
                EmailToName = @event.FullName,
                EmailBody = String.Format(contentTemplate, @event.ResetLink),
                HtmlBody = true
            };

            await _emailService.SendMailAsync(mailData);
        }

        private static string GetStringFromHtml(string rootPath, string fileName)
        {
            var filePath = Path.Combine(rootPath, "EmailTemplate", fileName);
            return File.ReadAllText(filePath);
        }
    }
}
