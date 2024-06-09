namespace Notification.API.DTOs.Emails
{
    public class MailData
    {
        public string EmailToId { get; set; }
        public string EmailToName { get; set; }
        public string EmailSubject { get; set; }
        public string EmailBody { get; set; }
        public bool HtmlBody { get; set; }
    }
}
