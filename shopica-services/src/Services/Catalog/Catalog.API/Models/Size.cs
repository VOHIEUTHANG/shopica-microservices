namespace Catalog.API.Models
{
    public class Size : BaseEntity
    {
        public int Id { get; set; }
        public string SizeName { get; set; }

        public IEnumerable<ProductSize> ProductSizes { get; set; }
    }
}
