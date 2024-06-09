namespace Notification.API.Models
{
    public class User : BaseEntity
    {
        public int Id { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string ImageUrl { get; set; }
    }
}
