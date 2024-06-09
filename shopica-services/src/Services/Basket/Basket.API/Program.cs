using Basket.API.Exceptions;
using Basket.API.Extensions;
using Basket.API.Infrastructure;
using Basket.API.Infrastructure.Data;
using Basket.API.IntegrationEvents.EventHandling;
using Basket.API.IntegrationEvents.Events;
using EventBus.Abstractions;
using EventBusLogEF;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Exceptions.Core;
using Serilog.Exceptions.EntityFrameworkCore.Destructurers;
using Serilog.Exceptions;
using Serilog.Formatting.Compact;
using Serilog.Enrichers.Sensitive;

Log.Logger = new LoggerConfiguration()
    .CreateBootstrapLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSerilog(CreateSerilogLogger(builder.Configuration));

builder.Services.ConfigureCORS();

builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddControllers();

builder.Services.ConfigureDbContext(builder.Configuration);

builder.Services.AddIntegrationEventConnector(builder.Configuration);

builder.Services.RegisterEventBus(builder.Configuration);

builder.Services.ConfigureServices();

builder.Services.AddHttpContextAccessor();

builder.Services.ConfigureRedis(builder.Configuration);

builder.Services.AddScoped(typeof(IBasketRepository<>), typeof(BasketRepository<>));
builder.Services.AddScoped(typeof(IRedisRepository<>), typeof(RedisRepository<>));

builder.Services.AddRouting(option => option.LowercaseUrls = true);

builder.Services.ConfigureHealthCheck(builder.Configuration);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseSerilogRequestLogging();

app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthentication();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

ConfigureEventBus(app);

app.UseHealthChecks("/hc", new HealthCheckOptions()
{
    Predicate = _ => true,
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

try
{
    Log.Information("Configuring web host ({ApplicationContext})...", Program.AppName);

    await SeedDataAsync(app);

    app.Logger.LogInformation("Starting web host ({ApplicationName})...", AppName);
    app.Run();

}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}



// Migrate latest database changes during startup

void ConfigureEventBus(IApplicationBuilder app)
{
    var eventBus = app.ApplicationServices.GetRequiredService<ISubscriber>();

    eventBus.Subscribe<OrderCreatedIntegrationEvent, OrderCreatedIntegrationEventHandler>();
}

async Task SeedDataAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<BasketDbContext>();
    var env = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<BasketContextSeed>>();

    await new BasketContextSeed().SeedAsync(context, env, app.Configuration, logger);
}

Serilog.ILogger CreateSerilogLogger(IConfiguration configuration)
{
    return new LoggerConfiguration()
        .Enrich.WithProperty("ApplicationContext", Program.AppName)
        .Enrich.FromLogContext()
        .Enrich.WithExceptionDetails(new DestructuringOptionsBuilder()
        .WithDefaultDestructurers()
        .WithDestructurers(new[] { new DbUpdateExceptionDestructurer() }))
        .ReadFrom.Configuration(configuration)
        .CreateLogger();
}


public partial class Program
{
    public static string Namespace = typeof(Program).Assembly.GetName().Name;
    public static string AppName = Namespace.Substring(Namespace.LastIndexOf('.', Namespace.LastIndexOf('.') - 1) + 1);
}