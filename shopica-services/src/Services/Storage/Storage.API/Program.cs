using EventBus.Abstractions;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Serilog.Exceptions.Core;
using Serilog.Exceptions.EntityFrameworkCore.Destructurers;
using Serilog;
using Storage.API.Exceptions;
using Storage.API.Extensions;
using Storage.API.IntegrationEvents.EventHandling;
using Storage.API.IntegrationEvents.Events;
using Storage.API.Interfaces;
using Storage.API.Services;
using Serilog.Exceptions;

Log.Logger = new LoggerConfiguration()
    .CreateBootstrapLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSerilog(CreateSerilogLogger(builder.Configuration));

builder.Services.ConfigureCORS();

builder.Services.AddControllers();

builder.Services.AddRouting(option => option.LowercaseUrls = true);

builder.Services.AddIntegrationServices(builder.Configuration);

builder.Services.RegisterEventBus(builder.Configuration);

builder.Services.AddTransient<IAwsS3Service, AwsS3Service>();

builder.Services.ConfigureAWS(builder.Configuration);

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

ConfigureEventBus(app);


app.UseHealthChecks("/hc", new HealthCheckOptions()
{
    Predicate = _ => true,
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});


try
{
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

void ConfigureEventBus(IApplicationBuilder app)
{
    var eventBus = app.ApplicationServices.GetRequiredService<ISubscriber>();

    eventBus.Subscribe<CategoryDeletedIntegrationEvent, CategoryDeletedIntegrationEventHandler>();
    eventBus.Subscribe<ProductImageDeletedIntegrationEvent, ProductImageDeletedIntegrationEventHandler>();
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