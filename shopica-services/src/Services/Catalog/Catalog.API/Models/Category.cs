namespace Catalog.API.Models
{
    public class Category : BaseEntity
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public string ImageUrl { get; set; }

        public IEnumerable<Product> Products { get; set; }
    }
}
