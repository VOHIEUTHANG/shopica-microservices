using Ardalis.Specification;
using Ratting.API.Models;

namespace Ratting.API.Specifications.Blogs
{
    public class BlogFilteredSpec : Specification<Blog>
    {
        public BlogFilteredSpec(string? title, string? tags)
        {
            if (!string.IsNullOrEmpty(tags))
            {
                var tagList = tags.ToLower().Split(',');
                Query.Where(p => p.Tags.Any(x => tagList.Contains(x)));
            }

            if (!string.IsNullOrEmpty(title))
            {
                Query.Search(b => b.Title, "%" + title + "%");
            }

            Query.AsNoTracking();
        }
    }
}
