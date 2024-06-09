using Ardalis.Specification;
using Ratting.API.Models;
using Ratting.API.Models.Enums;

namespace Ratting.API.Specifications.Comments
{
    public class CommentByDocumentSpec : Specification<Comment>
    {
        public CommentByDocumentSpec(CommentDocumentType type, int documentId)
        {
            Query.Where(c => c.DocumentType == type && c.DocumentId == documentId)
                .AsNoTracking();
        }
    }
}
