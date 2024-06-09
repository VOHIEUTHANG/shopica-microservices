namespace Catalog.API.DTOs.Products
{
    public class ProductFilter
    {
        public string? ProductName { get; set; }
        public string? CategoryName { get; set; }
        public string? SizeNames { get; set; }
        public string? ColorNames { get; set; }
        public string? BrandNames { get; set; }
        public string? Prices { get; set; }
        public string? Tags { get; set; }

    }
}
