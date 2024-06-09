using Ardalis.Specification;
using Ratting.API.DTOs;
using Ratting.API.Models;

namespace Ratting.API.Specifications.Blogs
{
    public class BlogPaginatedFilteredSpec : Specification<Blog>
    {
        public BlogPaginatedFilteredSpec(BaseParam param, string? title, string? tags)
        {
            if (param.SortField == "id" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.Id);
            }

            if (param.SortField == "createdAt" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.CreatedAt);
            }

            if (!string.IsNullOrEmpty(title))
            {
                Query.Search(b => b.Title, "%" + title + "%");
            }

            if (!string.IsNullOrEmpty(tags))
            {
                var tagList = tags.ToLower().Split(',');
                Query.Where(p => p.Tags.Any(x => tagList.Contains(x)));
            }

            Query.Skip(param.PageSize * (param.PageIndex - 1))
             .Take(param.PageSize)
             .AsNoTracking();
        }
    }
}
