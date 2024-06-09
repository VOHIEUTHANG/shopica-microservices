namespace Notification.API.Models
{
    public class Conversation : BaseEntity
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public int CreatorId { get; set; }
        public IList<Participant> Participants { get; set; }
    }
}
