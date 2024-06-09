namespace Notification.API.Models
{
    public class Message : BaseEntity
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public int SenderId { get; set; }
        public bool IsRead { get; set; }

        public int ConversationId { get; set; }
        public Conversation Conversation { get; set; }
        public IList<Attachment> Attachments { get; set; }

    }
}
