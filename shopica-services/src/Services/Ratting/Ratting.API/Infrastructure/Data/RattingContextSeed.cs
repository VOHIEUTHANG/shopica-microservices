using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Polly;
using Polly.Retry;
using Ratting.API.Models;
using System.Text.Json;

namespace Ratting.API.Infrastructure.Data
{
    public class RattingContextSeed
    {
        private readonly JsonSerializerOptions _options = new()
        {
            PropertyNameCaseInsensitive = true
        };
        public async Task SeedAsync(RattingDbContext context, IWebHostEnvironment env, IConfiguration configuration, ILogger<RattingContextSeed> logger)
        {
            var retryCount = 3;

            if (!string.IsNullOrEmpty(configuration["EventBus:RetryCount"]))
            {
                retryCount = int.Parse(configuration["EventBus:RetryCount"]);
            }

            var policy = CreatePolicy(logger, nameof(RattingContextSeed), retryCount);

            await policy.ExecuteAsync(async () =>
            {
                await context.Database.MigrateAsync();

                var contentRootPath = env.ContentRootPath;

                if (!context.Blogs.Any())
                {
                    await context.Blogs.AddRangeAsync(GetBlogsFromFile(contentRootPath, logger));

                    await context.SaveChangesAsync();
                }
            });
        }
        private IEnumerable<Blog> GetBlogsFromFile(string contentRootPath, ILogger<RattingContextSeed> logger)
        {
            string jsonFileBlogs = Path.Combine(contentRootPath, "Setup", "Blogs.json");

            if (!File.Exists(jsonFileBlogs))
            {
                return GetPreconfiguredBlogs();
            }

            try
            {
                using FileStream json = File.OpenRead(jsonFileBlogs);

                List<Blog> blogs = JsonSerializer.Deserialize<List<Blog>>(json, _options);

                return blogs;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "EXCEPTION ERROR: {Message}", ex.Message);
                return GetPreconfiguredBlogs();
            }
        }

        private IEnumerable<Blog> GetPreconfiguredBlogs()
        {
            return new List<Blog>()
            {
                new Blog()
                {
                   Id = 1,
                   Title = "COOL SPRING STREET STYLE LOOKS",
                   Content = "<p><br></p><p><span style=\"color: rgb(135, 135, 135); background-color: rgb(255, 255, 255);\">Typography is the work of&nbsp;</span><em style=\"color: rgb(34, 34, 34); background-color: rgb(255, 255, 255);\"><a href=\"https://demo-kalles-4-1.myshopify.com/blogs/fashion/cool-spring-street-style-looks#\" rel=\"noopener noreferrer\" target=\"_blank\">typesetters, compositors, typographers</a></em><em style=\"color: rgb(135, 135, 135); background-color: rgb(255, 255, 255);\">, graphic designers, art directors, manga artists, comic book artists, graffiti artists</em><span style=\"color: rgb(135, 135, 135); background-color: rgb(255, 255, 255);\">, and now—anyone who arranges words, letters, numbers, and symbols for publication, display, or distribution—from clerical&nbsp;</span><strong style=\"color: rgb(135, 135, 135); background-color: rgb(255, 255, 255);\">workers and newsletter writers to anyone</strong><span style=\"color: rgb(135, 135, 135); background-color: rgb(255, 255, 255);\">&nbsp;self-publishing materials.</span></p><blockquote><em style=\"background-color: rgb(241, 241, 241); color: rgb(135, 135, 135);\">Typography is the work of typesetters, compositors, typographers, graphic designers, art directors, manga artists, comic book artists, graffiti artists, and now—anyone who arranges words, letters, numbers, and symbols for publication, display, or distribution—from clerical workers and newsletter writers to anyone self-publishing materials.</em></blockquote><h3 class=\"ql-align-center\"><span style=\"color: var(--heading-color); background-color: rgb(255, 255, 255);\">OUTFIT COLLECTIONS</span></h3><p><span style=\"color: rgb(135, 135, 135); background-color: rgb(255, 255, 255);\"><img src=\"https://cdn.shopify.com/s/files/1/0616/9480/4174/files/p12-4_1x1.jpg?v=1653036297\"></span></p><p><br></p><p><span style=\"color: rgb(135, 135, 135); background-color: rgb(255, 255, 255);\">Until the Digital Age, typography was a specialized occupation. Digitization opened up typography to new generations of previously unrelated designers and lay users, and David Jury, head of graphic design at Colchester Institute in England, states that “typography is now something everybody does. As the capability to create typography has become ubiquitous, the application of principles and best practices developed over generations of skilled workers and professionals has diminished. Ironically, at a time when scientific techniques.</span></p>",
                   Tags = ["Sales", "Summer","Digital"],
                   Summary = "Typography is the work of typesetters",
                   AuthorName = "hieuvt19",
                   BackgroundUrl = "https://shopica-storage.s3.ap-southeast-1.amazonaws.com/shopica-files/blog-images/2024-04-30T09:13:37.942Z/1-7-1.png",
                }
            };
        }

        private AsyncRetryPolicy CreatePolicy(ILogger<RattingContextSeed> logger, string prefix, int retries = 3)
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
