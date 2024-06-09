using Ardalis.Specification;
using Ratting.API.Models;

namespace Ratting.API.Specifications.Blogs
{
    public class BlogByIdSpec : Specification<Blog>, ISingleResultSpecification<Blog>
    {
        public BlogByIdSpec(int blogId)
        {
            Query.Where(b => b.Id == blogId);
        }
    }
}
