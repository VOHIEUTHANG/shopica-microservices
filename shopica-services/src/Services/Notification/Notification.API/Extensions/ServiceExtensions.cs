using EventBus;
using EventBus.Abstractions;
using EventBusRabbitMQ;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using Notification.API.DTOs.Emails;
using Notification.API.Infrastructure.Data;
using Notification.API.IntegrationEvents.EventHandling;
using Notification.API.Interfaces;
using Notification.API.Services;
using RabbitMQ.Client;

namespace Notification.API.Extensions
{
    public static class ServiceExtensions
    {

        public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            var client = new MongoClient(configuration.GetConnectionString("NotificationConnectionString"));

            services.AddDbContext<NotificationDbContext>(c =>
                c.UseMongoDB(client, configuration["NotificationDBName"])
                .EnableSensitiveDataLogging());
        }

        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddTransient<INotificationService, NotificationService>();
            services.AddTransient<IEmailService, EmailService>();
        }

        public static void ConfigureSettings(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<MailSettings>(configuration.GetSection("MailSettings"));
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
            services.AddTransient<ProductCreatedIntegrationEventHandler>();
            services.AddTransient<ResetPasswordLinkGeneratedEventHandler>();
            services.AddSingleton<IEventBusSubscriptionsManager, InMemoryEventBusSubscriptionsManager>();
        }

        public static void ConfigureHealthCheck(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHealthChecks()
                    .AddMongoDb(configuration.GetConnectionString("NotificationConnectionString"), name: "notification-database-check", tags: ["database"])
                    .AddRabbitMQ($"amqp://{configuration["EventBus:Connection"]}", name: "notification-rabbitmqbus-check", tags: ["rabbitmqbus"]);
        }
    }
}
