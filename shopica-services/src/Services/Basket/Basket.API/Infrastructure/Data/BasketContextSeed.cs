using Microsoft.Data.SqlClient;
using Polly.Retry;
using Polly;
using System.Text.Json;
using Basket.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Basket.API.Infrastructure.Data
{
    public class BasketContextSeed
    {
        private readonly JsonSerializerOptions _options = new()
        {
            PropertyNameCaseInsensitive = true
        };
        public async Task SeedAsync(BasketDbContext context, IWebHostEnvironment env, IConfiguration configuration, ILogger<BasketContextSeed> logger)
        {
            var retryCount = 3;

            if (!string.IsNullOrEmpty(configuration["EventBus:RetryCount"]))
            {
                retryCount = int.Parse(configuration["EventBus:RetryCount"]);
            }

            var policy = CreatePolicy(logger, nameof(BasketContextSeed), retryCount);

            await policy.ExecuteAsync(async () =>
            {
                await context.Database.MigrateAsync();

                var contentRootPath = env.ContentRootPath;

                if (!context.Promotions.Any())
                {
                    await context.Promotions.AddRangeAsync(GetPromotionsFromFile(contentRootPath, logger));

                    await context.SaveChangesAsync();
                }
            });
        }

        private IEnumerable<Promotion> GetPromotionsFromFile(string contentRootPath, ILogger<BasketContextSeed> logger)
        {
            string jsonFilePromotions = Path.Combine(contentRootPath, "Setup", "Promotions.json");

            if (!File.Exists(jsonFilePromotions))
            {
                return GetPreconfiguredPromotions();
            }

            try
            {
                using FileStream json = File.OpenRead(jsonFilePromotions);

                List<Promotion> promotions = JsonSerializer.Deserialize<List<Promotion>>(json, _options);

                return promotions;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "EXCEPTION ERROR: {Message}", ex.Message);
                return GetPreconfiguredPromotions();
            }
        }

        private IEnumerable<Promotion> GetPreconfiguredPromotions()
        {
            return new List<Promotion>()
            {
                new Promotion()
                {
                    Type = Models.Enums.PromotionType.Discount,
                    Active = true,
                    Code = "28HJZ1",
                    Description = "The demo promotion discount",
                    SalesByAmount = 100,
                    PromotionDiscount = 10,
                    PromotionDiscountLimit = 20,
                    StartDate = new DateTime(1999,01,01),
                    EndDate = new DateTime(2099,12,31),
                    PromotionByName = string.Empty,
                    PromotionColorName = string.Empty,
                    PromotionSizeName = string.Empty,
                    SalesByName = string.Empty,
                    PromotionImageUrl = string.Empty,
                },
                 new Promotion()
                 {
                    Type = Models.Enums.PromotionType.Amount,
                    Active = true,
                    Code = "A8O147",
                    Description = "The demo promotion amount",
                    SalesByAmount = 100,
                    PromotionAmount = 10,
                    StartDate = new DateTime(1999,01,01),
                    EndDate = new DateTime(2099,12,31),
                    PromotionByName = string.Empty,
                    PromotionColorName = string.Empty,
                    PromotionSizeName = string.Empty,
                    SalesByName = string.Empty,
                    PromotionImageUrl = string.Empty,
                },
                  new Promotion()
                  {
                    Type = Models.Enums.PromotionType.Product,
                    Active = true,
                    Code = "DTL063",
                    Description = "The demo promotion product",
                    SalesById = 71,
                    SalesByName = "Nike Air Max 90 LV8",
                    SalesByQuantity = 3,
                    PromotionById = 71,
                    PromotionByName = "Nike Air Max 90 LV8",
                    PromotionQuantity = 1,
                    StartDate = new DateTime(1999,01,01),
                    EndDate = new DateTime(2099,12,31),
                    PromotionColorId = 31,
                    PromotionColorName = "White",
                    PromotionSizeId = 26,
                    PromotionSizeName = "40",
                    PromotionPrice = 150,
                    PromotionImageUrl = "https://shopica-storage.s3.ap-southeast-1.amazonaws.com/shopica-files/product-images/2024-03-06T13:22:08.452Z/air-max-90-lv8-shoes-5KhTdP%20(4).png",
                }
            };
        }

        private AsyncRetryPolicy CreatePolicy(ILogger<BasketContextSeed> logger, string prefix, int retries = 3)
        {
            return Policy.Handle<SqlException>().
                WaitAndRetryAsync(
                    retryCount: retries,
                    sleepDurationProvider: retry => TimeSpan.FromSeconds(5),
                    onRetry: (exception, timeSpan, retry, ctx) =>
                    {
                        logger.LogWarning(exception, "[{prefix}] Exception {ExceptionType} with message {Message} detected on attempt {retry} of {retries}", prefix, exception.GetType().Name, exception.Message, retry, retries);
                    }
                );
        }
    }
}
