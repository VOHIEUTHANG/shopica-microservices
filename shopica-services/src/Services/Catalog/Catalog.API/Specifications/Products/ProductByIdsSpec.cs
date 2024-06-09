using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Products
{
    public class ProductByIdsSpec : Specification<Product>, ISingleResultSpecification<Product>
    {
        public ProductByIdsSpec(string productIds)
        {
            var listProductId = productIds.ToLower().Split(',');

            Query.Include(p => p.ProductColors)
                .ThenInclude(pc => pc.Color)
                .Include(p => p.ProductSizes)
                .ThenInclude(ps => ps.Size)
                .Include(p => p.ProductImages)
                .Where(p => listProductId.Contains(p.Id.ToString()));
        }
    }
}
