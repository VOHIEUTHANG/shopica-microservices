using Basket.API.Infrastructure.Data;
using EventBusLogEF;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Ordering.API.Exceptions;
using Ordering.API.Extensions;
using Ordering.API.Infrastructure;
using Ordering.API.Infrastructure.Data;
using Serilog.Exceptions.Core;
using Serilog.Exceptions.EntityFrameworkCore.Destructurers;
using Serilog;
using Serilog.Exceptions;


Log.Logger = new LoggerConfiguration()
    .CreateBootstrapLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSerilog(CreateSerilogLogger(builder.Configuration));

builder.Services.ConfigureCORS();

builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddControllers();

builder.Services.ConfigureDbContext(builder.Configuration);

builder.Services.AddIntegrationServices(builder.Configuration);

builder.Services.RegisterEventBus(builder.Configuration);

builder.Services.ConfigureServices();

builder.Services.AddScoped(typeof(IOrderingRepository<>), typeof(OrderingRepository<>));

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
app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthentication();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

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
async Task SeedDataAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<OrderingDbContext>();
    var intergrationContext = scope.ServiceProvider.GetRequiredService<IntegrationEventLogContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<OrderingContextSeed>>();

    await new OrderingContextSeed().SeedAsync(context, intergrationContext, app.Configuration, logger);

    app.Logger.LogInformation("Starting web host ({ApplicationName})...", AppName);
}

public partial class Program
{
    public static string Namespace = typeof(Program).Assembly.GetName().Name;
    public static string AppName = Namespace.Substring(Namespace.LastIndexOf('.', Namespace.LastIndexOf('.') - 1) + 1);
}