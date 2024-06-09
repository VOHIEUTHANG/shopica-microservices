namespace Catalog.API.Models
{
    public class Brand : BaseEntity
    {
        public int Id { get; set; }
        public string BrandName { get; set; }
        public IEnumerable<Product> Products { get; set; }
    }
}
