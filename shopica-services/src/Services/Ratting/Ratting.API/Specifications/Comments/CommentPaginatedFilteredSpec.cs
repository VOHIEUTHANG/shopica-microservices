using Ardalis.Specification;
using Microsoft.EntityFrameworkCore;
using Ratting.API.DTOs;
using Ratting.API.Models;
using Ratting.API.Models.Enums;

namespace Ratting.API.Specifications.Comments
{
    public class CommentPaginatedFilteredSpec : Specification<Comment>
    {
        public CommentPaginatedFilteredSpec(BaseParam param, string? documentTypes, int documentId)
        {
            if (param.SortField == "id" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.Id);
            }

            if (!string.IsNullOrEmpty(documentTypes))
            {
                var DocumentTypeList = documentTypes.ToLower().Split(',').Select(s => (CommentDocumentType)Enum.Parse(typeof(CommentDocumentType), s));
                Query.Where(d => DocumentTypeList.Contains(d.DocumentType));
            }


            if (documentId != 0)
            {
                Query.Where(d => d.DocumentId == documentId);
            }

            Query.Skip(param.PageSize * (param.PageIndex - 1))
             .Take(param.PageSize)
             .AsNoTracking();
        }
    }
}
