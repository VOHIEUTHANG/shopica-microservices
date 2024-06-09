using Amazon;
using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon.S3;
using EventBus;
using EventBus.Abstractions;
using EventBusRabbitMQ;
using HealthChecks.Aws.S3;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using Storage.API.IntegrationEvents.EventHandling;
using Storage.API.Interfaces;
using Storage.API.Services;

namespace Storage.API.Extensions
{
    public static class ServiceExtensions
    {


        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddTransient<IAwsS3Service, AwsS3Service>();
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

        public static void ConfigureAWS(this IServiceCollection services, IConfiguration configuration)
        {
            AWSOptions awsOptions = new AWSOptions
            {
                Credentials = new BasicAWSCredentials(configuration["AWS:AccessKey"], configuration["AWS:SecretKey"]),
                Region = Amazon.RegionEndpoint.APSoutheast1
            };
            services.AddDefaultAWSOptions(awsOptions);

            services.AddAWSService<IAmazonS3>();
        }

        public static void AddIntegrationServices(this IServiceCollection services, IConfiguration configuration)
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

            services.AddSingleton<ISubscriber, SubscriberImpRabbitMQ>(sp =>
            {
                var subscriptionClientName = configuration["EventBus:SubscriptionClientName"];
                var rabbitMQPersistentConnection = sp.GetRequiredService<IRabbitMQPersistentConnection>();
                var logger = sp.GetRequiredService<ILogger<SubscriberImpRabbitMQ>>();
                var eventBusSubcriptionsManager = sp.GetRequiredService<IEventBusSubscriptionsManager>();

                return new SubscriberImpRabbitMQ(rabbitMQPersistentConnection, eventBusSubcriptionsManager, sp, logger, subscriptionClientName);
            });

            services.AddTransient<CategoryDeletedIntegrationEventHandler>();
            services.AddTransient<ProductImageDeletedIntegrationEventHandler>();
            services.AddSingleton<IEventBusSubscriptionsManager, InMemoryEventBusSubscriptionsManager>();
        }
        public static void ConfigureHealthCheck(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHealthChecks()
            .AddS3(o =>
            {
                o.S3Config = new AmazonS3Config
                {
                    RegionEndpoint = RegionEndpoint.APSoutheast1
                };
                o.Credentials = new BasicAWSCredentials(configuration["AWS:AccessKey"], configuration["AWS:SecretKey"]);
                o.BucketName = configuration["AWS:S3:BucketName"];
            },
            name: "storage-awss3-check", tags: ["awss3"])
            .AddRabbitMQ($"amqp://{configuration["EventBus:Connection"]}", name: "storage-rabbitmqbus-check", tags: ["rabbitmqbus"]);
        }
    }
}
