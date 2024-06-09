using EventBus;
using EventBus.Abstractions;
using EventBusRabbitMQ;
using Inventory.API.IntegrationEvents.EventHandling;
using Inventory.API.Interfaces;
using Inventory.API.Services;
using RabbitMQ.Client;

namespace Inventory.API.Extensions
{
    public static class ServiceExtensions
    {

        public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<InventoryDbContext>(c =>
               c.UseSqlServer(configuration.GetConnectionString("InventoryConnectionString"),
                sqlServerOptionsAction: sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 10,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorNumbersToAdd: null);
                })
               .EnableSensitiveDataLogging());
        }

        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddTransient<IWarehouseEntryService, WarehouseEntryService>();
            services.AddTransient<IPurchaseOrderService, PurchaseOrderService>();
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
        public static void ConfigureHealthCheck(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHealthChecks()
                    .AddDbContextCheck<InventoryDbContext>(name: "inventory-dbcontext-check", tags: ["dbcontext"])
                    .AddRabbitMQ($"amqp://{configuration["EventBus:Connection"]}", name: "inventory-rabbitmqbus-check", tags: ["rabbitmqbus"]);
        }

    }
}
