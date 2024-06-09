using Notification.API.Models.Enums;

namespace Notification.API.Models
{
    public class Participant : BaseEntity
    {
        public string ConversationId { get; set; }
        public int UserId { get; set; }
        public ParticipantRole Role { get; set; }
        public User User { get; set; }
        public Conversation Conversation { get; set; }
    }
}
