using Ardalis.Specification;
using Catalog.API.DTOs.Products;
using Catalog.API.Models;

namespace Catalog.API.Specifications.Products
{
    public class ProductFilteredSpec : Specification<Product>
    {
        public ProductFilteredSpec(ProductFilter productFilter)
        {
            if (!string.IsNullOrEmpty(productFilter.ProductName))
            {
                Query.Search(d => d.ProductName, "%" + productFilter.ProductName + "%");
            }

            if (!string.IsNullOrEmpty(productFilter.CategoryName) && productFilter.CategoryName != "all")
            {
                Query.Where(p => p.Category.CategoryName.ToLower() == productFilter.CategoryName.ToLower());
            }

            if (!string.IsNullOrEmpty(productFilter.BrandNames))
            {
                var brandNames = productFilter.BrandNames.ToLower().Split(',');
                Query.Where(d => brandNames.Contains(d.Brand.BrandName.ToLower()));
            }
            if (!string.IsNullOrEmpty(productFilter.SizeNames))
            {
                var sizeNames = productFilter.SizeNames.ToLower().Split(',');
                Query.Where(p => p.ProductSizes.Select(s => s.Size.SizeName.ToLower()).Any(x => sizeNames.Contains(x)));
            }

            if (!string.IsNullOrEmpty(productFilter.ColorNames))
            {
                var colorNames = productFilter.ColorNames.ToLower().Split(',');
                Query.Where(p => p.ProductColors.Select(s => s.Color.ColorName.ToLower()).Any(x => colorNames.Contains(x)));
            }

            if (!string.IsNullOrEmpty(productFilter.Tags))
            {
                var tagList = productFilter.Tags.ToLower().Split(',');
                Query.Where(p => p.Tags.Any(x => tagList.Contains(x)));
            }
            Query.AsNoTracking();
        }
    }
}
