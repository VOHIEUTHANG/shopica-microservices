using Ardalis.Specification;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Products
{
    public class ProductTagsSpec : Specification<Product, IEnumerable<string>>
    {
        public ProductTagsSpec()
        {
            Query.Select(x => x.Tags.Select(x => x.ToLower()));
        }
    }
}
