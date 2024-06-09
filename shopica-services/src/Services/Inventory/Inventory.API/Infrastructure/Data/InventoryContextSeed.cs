using Microsoft.Data.SqlClient;
using Polly.Retry;
using Polly;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace Basket.API.Infrastructure.Data
{
    public class InventoryContextSeed
    {
        private readonly JsonSerializerOptions _options = new()
        {
            PropertyNameCaseInsensitive = true
        };
        public async Task SeedAsync(InventoryDbContext context, IConfiguration configuration, ILogger<InventoryContextSeed> logger)
        {
            var retryCount = 3;

            if (!string.IsNullOrEmpty(configuration["EventBus:RetryCount"]))
            {
                retryCount = int.Parse(configuration["EventBus:RetryCount"]);
            }

            var policy = CreatePolicy(logger, nameof(InventoryContextSeed), retryCount);

            await policy.ExecuteAsync(async () =>
            {
                await context.Database.MigrateAsync();
            });
        }
        
        private AsyncRetryPolicy CreatePolicy(ILogger<InventoryContextSeed> logger, string prefix, int retries = 3)
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
