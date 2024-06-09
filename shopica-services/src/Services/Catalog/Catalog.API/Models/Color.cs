namespace Catalog.API.Models
{
    public class Color : BaseEntity
    {
        public int Id { get; set; }
        public string ColorCode { get; set; }
        public string ColorName { get; set; }

        public IEnumerable<ProductColor> ProductColors { get; set; }
    }
}
