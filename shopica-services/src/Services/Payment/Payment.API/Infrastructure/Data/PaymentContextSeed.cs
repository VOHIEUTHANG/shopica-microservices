using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Payment.API.Infrastructure.Data;
using Polly.Retry;
using Polly;
using Payment.API.Models;

namespace Identity.API.Infrastructure.Data
{
    public class PaymentContextSeed
    {
        private readonly JsonSerializerOptions _options = new()
        {
            PropertyNameCaseInsensitive = true
        };
        public async Task SeedAsync(PaymentDbContext context, IWebHostEnvironment env, IConfiguration configuration, ILogger<PaymentContextSeed> logger)
        {
            var retryCount = 3;

            if (!string.IsNullOrEmpty(configuration["EventBus:RetryCount"]))
            {
                retryCount = int.Parse(configuration["EventBus:RetryCount"]);
            }

            var policy = CreatePolicy(logger, nameof(PaymentContextSeed), retryCount);

            await policy.ExecuteAsync(async () =>
            {
                await context.Database.MigrateAsync();

                var contentRootPath = env.ContentRootPath;

                if (!context.PaymentMethods.Any())
                {
                    await context.PaymentMethods.AddRangeAsync(GetPaymentMethodsFromFile(contentRootPath, logger));

                    await context.SaveChangesAsync();
                }
            });
        }

        private IEnumerable<PaymentMethod> GetPaymentMethodsFromFile(string contentRootPath, ILogger<PaymentContextSeed> logger)
        {
            string jsonFilePaymentMethods = Path.Combine(contentRootPath, "Setup", "PaymentMethods.json");

            if (!File.Exists(jsonFilePaymentMethods))
            {
                return GetPreconfiguredPaymentMethods();
            }

            try
            {
                using FileStream json = File.OpenRead(jsonFilePaymentMethods);

                List<PaymentMethod> paymentMethods = JsonSerializer.Deserialize<List<PaymentMethod>>(json, _options);

                return paymentMethods;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "EXCEPTION ERROR: {Message}", ex.Message);
                return GetPreconfiguredPaymentMethods();
            }
        }
        private IEnumerable<PaymentMethod> GetPreconfiguredPaymentMethods()
        {
            return new List<PaymentMethod>()
            {
                new PaymentMethod()
                {
                     Id = 1,
                     Active = true,
                     Description = "Pay with cash",
                     Name = "COD",
                     ImageUrl = "https://www.coolmate.me/images/COD.svg"
                },
                new PaymentMethod()
                {
                     Id = 2,
                     Active = true,
                     Description = "Pay with Momo",
                     Name = "MOMO",
                     ImageUrl = "https://www.coolmate.me/images/momo-icon.png"
                },
                new PaymentMethod()
                {
                     Id = 3,
                     Active = true,
                     Description = "Pay with VnPay",
                     Name = "VNPAY",
                     ImageUrl = "https://www.coolmate.me/images/vnpay.png"
                }
            };
        }

        private AsyncRetryPolicy CreatePolicy(ILogger<PaymentContextSeed> logger, string prefix, int retries = 3)
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
