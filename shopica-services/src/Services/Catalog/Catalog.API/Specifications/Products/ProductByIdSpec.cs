using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Products
{
    public class ProductByIdSpec : Specification<Product>, ISingleResultSpecification<Product>
    {
        public ProductByIdSpec(int productId)
        {
            Query.Include(p => p.ProductColors)
                .ThenInclude(pc => pc.Color)
                .Include(p => p.ProductSizes)
                .ThenInclude(ps => ps.Size)
                .Include(p => p.ProductImages)
                .Where(p => p.Id == productId);
        }
    }
}
