using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.ProductImages
{
    public class ProductImageByIdSpec : Specification<ProductImage>, ISingleResultSpecification<ProductImage>
    {
        public ProductImageByIdSpec(int productImageId)
        {
            Query.Where(pi => pi.Id == productImageId);
        }
    }
}
