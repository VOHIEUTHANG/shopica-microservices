namespace Notification.API.Models
{
    public class Attachment : BaseEntity
    {
        public int Id { get; set; }
        public string FileUrl { get; set; }
        public string ContentType { get; set; }
        public int FileSize { get; set; }
    }
}
