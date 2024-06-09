using Microsoft.Data.SqlClient;
using Polly.Retry;
using Polly;
using System.Text.Json;
using Catalog.API.Models;
using EventBusLogEF;
using Microsoft.EntityFrameworkCore;

namespace Catalog.API.Infrastructure.Data
{
    public class CatalogContextSeed
    {
        private readonly JsonSerializerOptions _options = new()
        {
            PropertyNameCaseInsensitive = true
        };
        public async Task SeedAsync(CatalogDbContext context, IntegrationEventLogContext integEventContext, IWebHostEnvironment env, IConfiguration configuration, ILogger<CatalogContextSeed> logger)
        {
            var retryCount = 3;

            if (!string.IsNullOrEmpty(configuration["EventBus:RetryCount"]))
            {
                retryCount = int.Parse(configuration["EventBus:RetryCount"]);
            }

            var policy = CreatePolicy(logger, nameof(CatalogContextSeed), retryCount);

            await policy.ExecuteAsync(async () =>
            {
                await context.Database.MigrateAsync();

                await integEventContext.Database.MigrateAsync();

                var contentRootPath = env.ContentRootPath;

                if (!context.Categories.Any())
                {
                    await context.Categories.AddRangeAsync(GetCategoriesFromFile(contentRootPath, logger));

                    await context.SaveChangesAsync();
                }

                if (!context.Brands.Any())
                {
                    await context.Brands.AddRangeAsync(GetBrandsFromFile(contentRootPath, logger));

                    await context.SaveChangesAsync();
                }

                if (!context.Sizes.Any())
                {
                    await context.Sizes.AddRangeAsync(GetSizesFromFile(contentRootPath, logger));

                    await context.SaveChangesAsync();
                }

                if (!context.Colors.Any())
                {
                    await context.Colors.AddRangeAsync(GetColorsFromFile(contentRootPath, logger));

                    await context.SaveChangesAsync();
                }
                
                if (!context.Products.Any())
                {
                    await context.Products.AddRangeAsync(GetProductsFromFile(contentRootPath, logger));

                    await context.SaveChangesAsync();
                }
            });
        }

        private IEnumerable<Category> GetCategoriesFromFile(string contentRootPath, ILogger<CatalogContextSeed> logger)
        {
            string jsonFileCategories = Path.Combine(contentRootPath, "Setup", "Categories.json");

            if (!File.Exists(jsonFileCategories))
            {
                return GetPreconfiguredCategories();
            }

            try
            {
                using FileStream json = File.OpenRead(jsonFileCategories);

                List<Category> categories = JsonSerializer.Deserialize<List<Category>>(json, _options);

                return categories;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "EXCEPTION ERROR: {Message}", ex.Message);
                return GetPreconfiguredCategories();
            }
        }

        private IEnumerable<Category> GetPreconfiguredCategories()
        {
            return new List<Category>()
            {
                new Category()
                {
                   Id = 1,
                   CategoryName = "Shoes",
                   ImageUrl = "https://shopica-storage.s3.ap-southeast-1.amazonaws.com/shopica-files/category-images/2024-03-06T06:04:03.278Z/air-max-90-lv8-shoes-5KhTdP.png"
                },
                new Category()
                {
                Id = 2,
                CategoryName = "Short",
                ImageUrl = "https://shopica-storage.s3.ap-southeast-1.amazonaws.com/shopica-files/category-images/2024-03-10T09:00:01.218Z/jordan-brooklyn-fleece-shorts-DCdcGB.jfif"
                },
                new Category()
                {
                    Id = 3,
                    CategoryName = "T-shirt",
                    ImageUrl = "https://shopica-storage.s3.ap-southeast-1.amazonaws.com/shopica-files/category-images/2024-03-10T09:00:55.211Z/jordan-flight-mvp-85-t-shirt-hdS3DZ (1).jfif"
                }
            };
        }

        private IEnumerable<Brand> GetBrandsFromFile(string contentRootPath, ILogger<CatalogContextSeed> logger)
        {
            string jsonFileCategories = Path.Combine(contentRootPath, "Setup", "Brands.json");

            if (!File.Exists(jsonFileCategories))
            {
                return GetPreconfiguredBrands();
            }

            try
            {
                using FileStream json = File.OpenRead(jsonFileCategories);

                List<Brand> categories = JsonSerializer.Deserialize<List<Brand>>(json, _options);

                return categories;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "EXCEPTION ERROR: {Message}", ex.Message);
                return GetPreconfiguredBrands();
            }
        }

        private IEnumerable<Brand> GetPreconfiguredBrands()
        {
            return new List<Brand>()
            {
                new Brand()
                {
                   Id = 1,
                   BrandName = "Uniqlo"
                },
                new Brand()
                {
                    Id = 2,
                    BrandName = "Nike"
                },
                new Brand()
                {
                    Id = 3,
                    BrandName = "Adidas",
                }
            };
        }

        private IEnumerable<Size> GetSizesFromFile(string contentRootPath, ILogger<CatalogContextSeed> logger)
        {
            string jsonFileSizes = Path.Combine(contentRootPath, "Setup", "Sizes.json");

            if (!File.Exists(jsonFileSizes))
            {
                return GetPreconfiguredSizes();
            }

            try
            {
                using FileStream json = File.OpenRead(jsonFileSizes);

                List<Size> sizes = JsonSerializer.Deserialize<List<Size>>(json, _options);

                return sizes;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "EXCEPTION ERROR: {Message}", ex.Message);
                return GetPreconfiguredSizes();
            }
        }

        private IEnumerable<Size> GetPreconfiguredSizes()
        {
            return new List<Size>()
            {
                new Size()
                {
                   Id = 1,
                   SizeName = "XS"
                },
                new Size()
                {
                    Id = 2,
                    SizeName = "S"
                },
                new Size()
                {
                    Id = 3,
                    SizeName = "M",
                }
            };
        }

        private IEnumerable<Color> GetColorsFromFile(string contentRootPath, ILogger<CatalogContextSeed> logger)
        {
            string jsonFileColors = Path.Combine(contentRootPath, "Setup", "Colors.json");

            if (!File.Exists(jsonFileColors))
            {
                return GetPreconfiguredColors();
            }

            try
            {
                using FileStream json = File.OpenRead(jsonFileColors);

                List<Color> colors = JsonSerializer.Deserialize<List<Color>>(json, _options);

                return colors;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "EXCEPTION ERROR: {Message}", ex.Message);
                return GetPreconfiguredColors();
            }
        }

        private IEnumerable<Color> GetPreconfiguredColors()
        {
            return new List<Color>()
            {
                new Color()
                {
                   Id = 1,
                   ColorName = "Black",
                   ColorCode = "#1c1b1b"
                },
                new Color()
                {
                    Id = 2,
                    ColorName = "Gray",
                    ColorCode = "#939393"
                },
                new Color()
                {
                    Id = 3,
                    ColorName = "Blue",
                    ColorCode = "#6588f4"
                }
            };
        }
        private IEnumerable<Product> GetProductsFromFile(string contentRootPath, ILogger<CatalogContextSeed> logger)
        {
            string jsonFileProducts = Path.Combine(contentRootPath, "Setup", "Products.json");

            if (!File.Exists(jsonFileProducts))
            {
                return GetPreconfiguredProducts();
            }

            try
            {
                using FileStream json = File.OpenRead(jsonFileProducts);

                List<Product> products = JsonSerializer.Deserialize<List<Product>>(json, _options);

                return products;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "EXCEPTION ERROR: {Message}", ex.Message);
                return GetPreconfiguredProducts();
            }
        }

        private IEnumerable<Product> GetPreconfiguredProducts()
        {
            return new List<Product>()
            {
                new Product()
                {
                   Id = 1,
                   ProductName = "Nike Air Max 90 LV8",
                   Price = 150,
                   Tags = ["trending","shoes"],
                   CategoryId = 1,
                   BrandId = 2,
                   ProductImages = new List<ProductImage>()
                   {
                       new ProductImage()
                       {
                           Id = 1,
                           ImageUrl = "https://shopica-storage.s3.ap-southeast-1.amazonaws.com/shopica-files/product-images/2024-03-06T13:22:08.453Z/air-max-90-lv8-shoes-5KhTdP (2).png"
                       },
                        new ProductImage()
                       {
                           Id = 2,
                           ImageUrl = "https://shopica-storage.s3.ap-southeast-1.amazonaws.com/shopica-files/product-images/2024-03-06T13:22:08.452Z/air-max-90-lv8-shoes-5KhTdP (5).png"
                       }
                   },
                   ProductColors = new List<ProductColor>()
                   {
                       new ProductColor()
                       {
                           ColorId = 1,
                       },
                       new ProductColor()
                       {
                           ColorId = 2
                       }
                   },
                   ProductSizes = new List<ProductSize>()
                   {
                       new ProductSize()
                       {
                           SizeId = 1,
                       },
                       new ProductSize()
                       {
                           SizeId = 2,
                       }
                   }
                }
            };
        }

        private AsyncRetryPolicy CreatePolicy(ILogger<CatalogContextSeed> logger, string prefix, int retries = 3)
        {
            return Policy.Handle<SqlException>().
                WaitAndRetryAsync(
                    retryCount: retries,
                    sleepDurationProvider: retry => TimeSpan.FromSeconds(Math.Pow(2, retry)),
                    onRetry: (exception, timeSpan, retry, ctx) =>
                    {
                        logger.LogWarning(exception, "[{prefix}] Exception {ExceptionType} with message {Message} detected on attempt {retry} of {retries}", prefix, exception.GetType().Name, exception.Message, retry, retries);
                    }
                );
        }
    }
}
