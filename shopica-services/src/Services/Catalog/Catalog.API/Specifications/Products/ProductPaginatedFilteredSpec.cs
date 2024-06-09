using Ardalis.Specification;
using Catalog.API.DTOs;
using Catalog.API.DTOs.Products;
using Catalog.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Catalog.API.Specifications.Products
{
    public class ProductPaginatedFilteredSpec : Specification<Product>
    {
        public ProductPaginatedFilteredSpec(BaseParam param, ProductFilter productFilter)
        {
            if (param.SortField == "price")
            {
                if (param.SortOrder == "descend")
                    Query.OrderByDescending(d => d.Price);
                else Query.OrderBy(d => d.Price);
            }

            if (param.SortField == "productName")
            {
                if (param.SortOrder == "descend")
                    Query.OrderByDescending(d => d.ProductName);
                else Query.OrderBy(d => d.ProductName);
            }

            if (param.SortField == "createdAt")
            {
                if (param.SortOrder == "descend")
                    Query.OrderByDescending(d => d.CreatedAt);
                else Query.OrderBy(d => d.CreatedAt);
            }

            if (!string.IsNullOrEmpty(productFilter.ProductName))
            {
                //Query.Search(d => d.ProductName, "%" + productFilter.ProductName + "%");
                var query = $"\"{productFilter.ProductName}*\" " +
                    $"OR FORMSOF(INFLECTIONAL, {productFilter.ProductName}) " +
                    $"OR FORMSOF(THESAURUS, {productFilter.ProductName})";

                Query.Where(x => EF.Functions.Contains(x.ProductName, query));
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

            Query
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.ProductColors)
                .ThenInclude(pc => pc.Color)
                .Include(p => p.ProductSizes)
                .ThenInclude(ps => ps.Size)
                .Include(p => p.ProductImages)
                .Skip(param.PageSize * (param.PageIndex - 1))
                .Take(param.PageSize)
                .AsNoTracking();
        }
    }
}
