using Ardalis.Specification;
using Ratting.API.Models;
using Ratting.API.Models.Enums;

namespace Ratting.API.Specifications.Comments
{
    public class CommentFilteredSpec : Specification<Comment>
    {
        public CommentFilteredSpec(string? documentTypes, int documentId)
        {
            if (!string.IsNullOrEmpty(documentTypes))
            {
                var DocumentTypeList = documentTypes.ToLower().Split(',').Select(s => (CommentDocumentType)Enum.Parse(typeof(CommentDocumentType), s));
                Query.Where(d => DocumentTypeList.Contains(d.DocumentType));
            }

            if (documentId != 0)
            {
                Query.Where(d => d.DocumentId == documentId);
            }

            Query.AsNoTracking();
        }
    }
}
