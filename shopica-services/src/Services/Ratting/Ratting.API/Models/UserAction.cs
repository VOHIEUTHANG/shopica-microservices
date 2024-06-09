using Ratting.API.Models.Enums;

namespace Ratting.API.Models
{
    public class UserAction
    {
        public int UserId { get; set; }
        public int CommentId { get; set; }
        public Actions Action { get; set; }
    }
}
