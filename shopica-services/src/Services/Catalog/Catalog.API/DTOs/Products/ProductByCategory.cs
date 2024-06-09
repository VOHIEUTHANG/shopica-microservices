namespace Catalog.API.DTOs.Products
{
    public class ProductByCategory
    {
        public string CategoryName { get; set; }
        public List<int> ProductIds { get; set; }
    }
}
