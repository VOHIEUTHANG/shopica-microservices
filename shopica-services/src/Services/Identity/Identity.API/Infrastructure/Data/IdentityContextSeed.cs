using Microsoft.Data.SqlClient;
using Polly.Retry;
using Polly;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using Identity.API.DTOs.Roles;
using Identity.API.Models.Enums;
using Identity.API.Extensions;
using System.Text.Json;
using Identity.API.Models;
using CryptoHelper;
using EventBusLogEF;

namespace Identity.API.Infrastructure.Data
{
    public class IdentityContextSeed
    {
        private readonly JsonSerializerOptions _options = new()
        {
            PropertyNameCaseInsensitive = true
        };
        public async Task SeedAsync(IdentityDbContext context, IntegrationEventLogContext integEventContext, IWebHostEnvironment env, IConfiguration configuration, ILogger<IdentityContextSeed> logger)
        {
            var retryCount = 3;

            if (!string.IsNullOrEmpty(configuration["EventBus:RetryCount"]))
            {
                retryCount = int.Parse(configuration["EventBus:RetryCount"]);
            }

            var policy = CreatePolicy(logger, nameof(IdentityContextSeed), retryCount);

            await policy.ExecuteAsync(async () =>
            {
                await context.Database.MigrateAsync();

                await integEventContext.Database.MigrateAsync();

                var contentRootPath = env.ContentRootPath;

                if (!context.Users.Any())
                {
                    await context.Users.AddRangeAsync(GetUsersFromFile(contentRootPath, logger));

                    await context.SaveChangesAsync();
                }
            });
        }

        private IEnumerable<User> GetUsersFromFile(string contentRootPath, ILogger<IdentityContextSeed> logger)
        {
            string jsonFileUsers = Path.Combine(contentRootPath, "Setup", "Users.json");

            if (!File.Exists(jsonFileUsers))
            {
                return GetPreconfiguredUsers();
            }

            try
            {
                using FileStream json = File.OpenRead(jsonFileUsers);

                List<User> users = JsonSerializer.Deserialize<List<User>>(json, _options);

                foreach (var user in users)
                {
                    user.Password = Crypto.HashPassword(user.Password);
                }

                return users;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "EXCEPTION ERROR: {Message}", ex.Message);
                return GetPreconfiguredUsers();
            }
        }
        private IEnumerable<User> GetPreconfiguredUsers()
        {
            return new List<User>()
            {
                new User()
                {
                    Username = "admin",
                    FullName = "Shopica Admin",
                    Password = Crypto.HashPassword("admin"),
                    Email = "shopica@gmail.com",
                    IsActive = true,
                    ImageUrl = "https://shopica-storage.s3.ap-southeast-1.amazonaws.com/shopica-files/user-images/2024-03-01T10:24:58.171Z/HieuVO%20(2).png",
                    Phone = string.Empty,
                    Provider = UserProviders.SHOPICA,
                    ProviderKey = UserProviders.SHOPICA,
                    Role = new Role()
                    {
                        RoleName = RoleNames.SUPER,
                        RoleDescription = "SUPER Role",
                    },
                    Addresses = new List<Address>()
                    {
                        new Address()
                        {
                            ProvinceId = 202,
                            ProvinceName = "Ho Chi Minh City",
                            DistrictId = 1451,
                            DistrictName = "District 9",
                            WardCode = "20908",
                            WardName = "Ward Phuoc Long A",
                            Street = "45 Street 7",
                            FullAddress = "45 Street 7 - Ward Phuoc Long A - District 9 - Ho Chi Minh City"
                        }
                    }
                },
                new User()
                {
                    Username = "kevinDb",
                    FullName = "Kevin De Bruyne",
                    Password = Crypto.HashPassword("kevin@123"),
                    Email = "kevin@gmail.com",
                    IsActive = true,
                    ImageUrl = "https://www.mancity.com/meta/media/z00hnhu0/kevin-de-bruyne.png",
                    Phone = string.Empty,
                    Provider = UserProviders.SHOPICA,
                    ProviderKey = UserProviders.SHOPICA,
                    Role = new Role()
                    {
                        RoleName = RoleNames.DEFAULT,
                        RoleDescription = "DEFAULT Role",
                    },
                    Addresses = new List<Address>()
                    {
                        new Address()
                        {
                            ProvinceId = 202,
                            ProvinceName = "Ho Chi Minh City",
                            DistrictId = 1451,
                            DistrictName = "District 9",
                            WardCode = "20908",
                            WardName = "Ward Phuoc Long A",
                            Street = "45 Street 7",
                            FullAddress = "45 Street 7 - Ward Phuoc Long A - District 9 - Ho Chi Minh City"
                        }
                    }
                }
            };
        }

        private AsyncRetryPolicy CreatePolicy(ILogger<IdentityContextSeed> logger, string prefix, int retries = 3)
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
