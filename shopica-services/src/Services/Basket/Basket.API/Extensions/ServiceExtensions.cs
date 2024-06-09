

using Basket.API.Infrastructure.Data;
using Basket.API.IntegrationEvents.EventHandling;
using Basket.API.Interfaces;
using Basket.API.Services;
using EventBus;
using EventBus.Abstractions;
using EventBusRabbitMQ;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using RabbitMQ.Client;


namespace Basket.API.Extensions
{
    public static class ServiceExtensions
    {

        public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<BasketDbContext>(c =>
               c.UseSqlServer(configuration.GetConnectionString("BasketConnectionString"),
                 sqlServerOptionsAction: sqlOptions =>
                 {
                     sqlOptions.EnableRetryOnFailure(
                     maxRetryCount: 10,
                     maxRetryDelay: TimeSpan.FromSeconds(30),
                     errorNumbersToAdd: null);
                 })
               .EnableSensitiveDataLogging(false));

        }
        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddTransient<IPromotionService, PromotionService>();
            services.AddTransient<IWishlistService, RedisWishlistService>();
            services.AddTransient<ICartService, RedisCartService>();
        }
        public static void ConfigureCORS(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                   policy =>
                   {
                       policy
                        .WithOrigins("http://localhost:4200", "http://localhost:4400", "https://hieuvo1.github.io", "https://shopica-admin.hvtauthor.com", "https://shopica-client.hvtauthor.com")
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials();
                   }
               );
            });
        }
        public static void AddIntegrationEventConnector(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IRabbitMQPersistentConnection>(sp =>
            {
                var logger = sp.GetRequiredService<ILogger<DefaultRabbitMQPersistentConnection>>();

                var factory = new ConnectionFactory()
                {
                    HostName = configuration["EventBus:Connection"],
                    DispatchConsumersAsync = true
                };

                if (!string.IsNullOrEmpty(configuration["EventBus:UserName"]))
                {
                    factory.UserName = configuration["EventBus:UserName"];
                }

                if (!string.IsNullOrEmpty(configuration["EventBus:Password"]))
                {
                    factory.Password = configuration["EventBus:Password"];
                }

                var retryCount = 5;
                if (!string.IsNullOrEmpty(configuration["EventBus:RetryCount"]))
                {
                    retryCount = int.Parse(configuration["EventBus:RetryCount"]);
                }
                return new DefaultRabbitMQPersistentConnection(factory, logger, retryCount);
            });
        }

        public static void RegisterEventBus(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IPublisher, PublishImpRabbitMQ>(sp =>
            {
                var rabbitMQPersistentConnection = sp.GetRequiredService<IRabbitMQPersistentConnection>();
                var logger = sp.GetRequiredService<ILogger<PublishImpRabbitMQ>>();
                var retryCount = 5;

                if (!string.IsNullOrEmpty(configuration["EventBus:RetryCount"]))
                {
                    retryCount = int.Parse(configuration["EventBus:RetryCount"]);
                }

                return new PublishImpRabbitMQ(rabbitMQPersistentConnection, logger, retryCount);
            });

            services.AddSingleton<EventBus.Abstractions.ISubscriber, SubscriberImpRabbitMQ>(sp =>
            {
                var subscriptionClientName = configuration["EventBus:SubscriptionClientName"];
                var rabbitMQPersistentConnection = sp.GetRequiredService<IRabbitMQPersistentConnection>();
                var logger = sp.GetRequiredService<ILogger<SubscriberImpRabbitMQ>>();
                var eventBusSubcriptionsManager = sp.GetRequiredService<IEventBusSubscriptionsManager>();

                return new SubscriberImpRabbitMQ(rabbitMQPersistentConnection, eventBusSubcriptionsManager, sp, logger, subscriptionClientName);
            });

            services.AddTransient<OrderCreatedIntegrationEventHandler>();
            services.AddSingleton<IEventBusSubscriptionsManager, InMemoryEventBusSubscriptionsManager>();
        }

        public static void ConfigureRedis(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = configuration.GetConnectionString("RedisConString");
                options.InstanceName = "SampleInstance";
            });
        }

        public static void ConfigureHealthCheck(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHealthChecks()
                    .AddDbContextCheck<BasketDbContext>(name: "basket-dbcontext-check", tags: ["dbcontext"])
                    .AddRedis(configuration.GetConnectionString("RedisConString"), name: "basket-redis-check", tags: ["redis"])
                    .AddRabbitMQ($"amqp://{configuration["EventBus:Connection"]}", name: "basket-rabbitmqbus-check", tags: ["rabbitmqbus"]);
        }
    }
}
