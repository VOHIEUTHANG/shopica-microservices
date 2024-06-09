using Microsoft.Data.SqlClient;
using Polly.Retry;
using Polly;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Ordering.API.Infrastructure.Data;
using EventBusLogEF;

namespace Basket.API.Infrastructure.Data
{
    public class OrderingContextSeed
    {
        private readonly JsonSerializerOptions _options = new()
        {
            PropertyNameCaseInsensitive = true
        };
        public async Task SeedAsync(OrderingDbContext context, IntegrationEventLogContext integEventContext, IConfiguration configuration, ILogger<OrderingContextSeed> logger)
        {
            var retryCount = 3;

            if (!string.IsNullOrEmpty(configuration["EventBus:RetryCount"]))
            {
                retryCount = int.Parse(configuration["EventBus:RetryCount"]);
            }

            var policy = CreatePolicy(logger, nameof(OrderingContextSeed), retryCount);

            await policy.ExecuteAsync(async () =>
            {
                await context.Database.MigrateAsync();
                await integEventContext.Database.MigrateAsync();
            });
        }

        private AsyncRetryPolicy CreatePolicy(ILogger<OrderingContextSeed> logger, string prefix, int retries = 3)
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
