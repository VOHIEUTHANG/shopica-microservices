
using Microsoft.EntityFrameworkCore;
using Ratting.API.Infrastructure.Data;
using Ratting.API.Interfaces;
using Ratting.API.Services;

namespace Ratting.API.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<RattingDbContext>(c =>
               c.UseSqlServer(configuration.GetConnectionString("RattingConnectionString"),
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
            services.AddTransient<ICommentService, CommentService>();
            services.AddTransient<IBlogService, BlogService>();
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
        public static void ConfigureHealthCheck(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHealthChecks()
                    .AddDbContextCheck<RattingDbContext>(name: "ratting-dbcontext-check", tags: ["dbcontext"]);
        }

    }
}
