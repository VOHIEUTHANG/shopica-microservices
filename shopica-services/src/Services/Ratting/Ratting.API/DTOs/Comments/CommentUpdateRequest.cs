using Ratting.API.Models.Enums;

namespace Ratting.API.DTOs.Comments
{
    public class CommentUpdateRequest
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int CustomerId { get; set; }
        public string Email { get; set; }
        public string CustomerName { get; set; }
        public string CustomerImageUrl { get; set; }
        public int Rate { get; set; }
        public CommentDocumentType DocumentType { get; set; }
        public int DocumentId { get; set; }
    }
}
