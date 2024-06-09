namespace Ratting.API.DTOs.Blogs
{
    public class BlogCreateRequest
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Summary { get; set; }
        public string[] Tags { get; set; }
        public string AuthorName { get; set; }
        public string BackgroundUrl { get; set; }
    }
}
