using EventBus;
using EventBus.Abstractions;
using EventBusLogEF;
using EventBusLogEF.Services;
using EventBusRabbitMQ;
using Identity.API.Infrastructure.Data;
using Identity.API.Interfaces;
using Identity.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RabbitMQ.Client;
using System.Data.Common;
using System.Reflection;
using System.Text;

namespace Identity.API.Extensions
{
    public static class ServiceExtensions
    {

        public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<IdentityDbContext>(c =>
               c.UseSqlServer(configuration.GetConnectionString("IdentityConnectionString"),
                sqlServerOptionsAction: sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 10,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorNumbersToAdd: null);
                })
               .EnableSensitiveDataLogging());

            services.AddDbContext<IntegrationEventLogContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("IdentityConnectionString"),
                sqlServerOptionsAction: sqlOptions =>
                {
                    sqlOptions.MigrationsAssembly(typeof(Program).GetTypeInfo().Assembly.GetName().Name);
                    sqlOptions.EnableRetryOnFailure(maxRetryCount: 15, maxRetryDelay: TimeSpan.FromSeconds(30), errorNumbersToAdd: null);
                });
            });
        }

        public static void AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = configuration["Authentication:Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = configuration["Authentication:Jwt:Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Authentication:Jwt:Key"]))
                };
            });
        }


        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IRoleService, RoleService>();
            services.AddTransient<IAuthService, AuthService>();

            services.AddTransient<Func<DbConnection, IIntegrationEventLogService>>(
          sp => (DbConnection c) => new IntegrationEventLogService(c));
            services.AddTransient<IIdentityIntegrationEventService, IdentityIntegrationEventService>();
        }

        public static void ConfigureCORS(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                   policy =>
                   {
                       policy
                        .WithOrigins("http://localhost:4200", "http://localhost:4400", "https://hieuvo1.github.io", "https://shopica-admin.hvtauthor.com", "https://shopica-client.hvtauthor.com", "http://shopica-admin.hvtauthor.com.s3-website-ap-southeast-1.amazonaws.com")
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials();
                   }
               );
            });
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

            services.AddSingleton<IEventBusSubscriptionsManager, InMemoryEventBusSubscriptionsManager>();
        }
        public static void ConfigureHealthCheck(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHealthChecks()
                    .AddDbContextCheck<IdentityDbContext>(name: "identity-dbcontext-check", tags: ["dbcontext"])
                    .AddRabbitMQ($"amqp://{configuration["EventBus:Connection"]}", name: "identity-rabbitmqbus-check", tags: ["rabbitmqbus"]);
        }
    }
}
