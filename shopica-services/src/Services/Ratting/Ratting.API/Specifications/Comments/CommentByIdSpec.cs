using Ardalis.Specification;
using Ratting.API.Models;

namespace Ratting.API.Specifications.Comments
{
    public class CommentByIdSpec : Specification<Comment>, ISingleResultSpecification<Comment>
    {
        public CommentByIdSpec(int commentId)
        {
            Query.Where(b => b.Id == commentId);
        }
    }
}
