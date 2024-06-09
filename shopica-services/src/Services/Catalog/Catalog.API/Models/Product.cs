namespace Catalog.API.Models
{
    public class Product : BaseEntity
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public Decimal Price { get; set; }
        public string[] Tags { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public Category Category { get; set; }
        public Brand Brand { get; set; }
        public IEnumerable<ProductImage> ProductImages { get; set; }
        public IEnumerable<ProductSize> ProductSizes { get; set; }
        public IEnumerable<ProductColor> ProductColors { get; set; }
    }
}
