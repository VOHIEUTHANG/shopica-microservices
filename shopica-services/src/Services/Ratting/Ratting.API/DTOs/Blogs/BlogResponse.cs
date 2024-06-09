namespace Ratting.API.DTOs.Blogs
{
    public class BlogResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Summary { get; set; }
        public string[] Tags { get; set; }
        public string AuthorName { get; set; }
        public string BackgroundUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
