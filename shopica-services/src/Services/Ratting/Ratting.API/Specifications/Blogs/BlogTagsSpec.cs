using Ardalis.Specification;
using Ratting.API.Models;

namespace Ratting.API.Specifications.Blogs
{
    public class BlogTagsSpec : Specification<Blog, IEnumerable<string>>
    {
        public BlogTagsSpec()
        {
            Query.Select(x => x.Tags.Select(x => x.ToLower()));
        }
    }
}
