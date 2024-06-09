using EventBus.Abstractions;
using EventBus.Events;
using EventBusLogEF.Services;
using EventBusLogEF.Utilities;
using Identity.API.Infrastructure.Data;
using Identity.API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace Identity.API.Services
{
    public class IdentityIntegrationEventService : IIdentityIntegrationEventService
    {
        private readonly IPublisher _publisher;
        private readonly IIntegrationEventLogService _eventLogService;
        private readonly ILogger<IdentityIntegrationEventService> _logger;
        private readonly IdentityDbContext _identityContext;
        private readonly Func<DbConnection, IIntegrationEventLogService> _integrationEventLogServiceFactory;
        private volatile bool disposedValue;

        public IdentityIntegrationEventService(
            IPublisher publisher,
            ILogger<IdentityIntegrationEventService> logger,
            IdentityDbContext identityContext,
            Func<DbConnection, IIntegrationEventLogService> integrationEventLogServiceFactory)
        {
            _publisher = publisher;
            _logger = logger;
            _identityContext = identityContext ?? throw new ArgumentNullException(nameof(identityContext));
            _integrationEventLogServiceFactory = integrationEventLogServiceFactory ?? throw new ArgumentNullException(nameof(integrationEventLogServiceFactory));
            _eventLogService = _integrationEventLogServiceFactory(_identityContext.Database.GetDbConnection());
        }
        public async Task SaveEventAndIdentityContextChangesAsync(IntegrationEvent evt)
        {
            _logger.LogInformation("----- IdentityIntegrationEventService - Saving changes and integrationEvent: {IntegrationEventId}", evt.Id);

            //Use of an EF Core resiliency strategy when using multiple DbContexts within an explicit BeginTransaction():
            //See: https://docs.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency            
            await ResilientTransaction.New(_identityContext).ExecuteAsync(async () =>
            {
                // Achieving atomicity between original catalog database operation and the IntegrationEventLog thanks to a local transaction
                await _identityContext.SaveChangesAsync();
                await _eventLogService.SaveEventAsync(evt, _identityContext.Database.CurrentTransaction);
            });
        }

        public async Task PublishThroughEventBusAsync(IntegrationEvent evt)
        {
            try
            {
                _logger.LogInformation("----- Publishing integration event: {IntegrationEventId_published} from {AppName} - ({@IntegrationEvent})", evt.Id, Program.AppName, evt);
                await _eventLogService.MarkEventAsInProgressAsync(evt.Id);
                _publisher.Publish(evt);
                await _eventLogService.MarkEventAsPublishedAsync(evt.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ERROR Publishing integration event: {IntegrationEventId} from {AppName} - ({@IntegrationEvent})", evt.Id, Program.AppName, evt);
                await _eventLogService.MarkEventAsFailedAsync(evt.Id);
            }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    (_eventLogService as IDisposable)?.Dispose();
                }

                disposedValue = true;
            }
        }

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
