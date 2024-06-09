using EventBus.Abstractions;
using EventBus.Events;
using EventBusLogEF.Services;
using EventBusLogEF.Utilities;
using Microsoft.EntityFrameworkCore;
using Ordering.API.Infrastructure.Data;
using Ordering.API.Interfaces;
using System.Data.Common;

namespace Ordering.API.Services
{
    public class OrderingIntegrationEventService : IOrderingIntegrationEventService, IDisposable
    {
        private readonly IPublisher _publisher;
        private readonly IIntegrationEventLogService _eventLogService;
        private readonly ILogger<OrderingIntegrationEventService> _logger;
        private readonly OrderingDbContext _orderingContext;
        private readonly Func<DbConnection, IIntegrationEventLogService> _integrationEventLogServiceFactory;
        private volatile bool disposedValue;
        public OrderingIntegrationEventService(
            IPublisher publisher,
            ILogger<OrderingIntegrationEventService> logger,
            OrderingDbContext orderingContext,
            Func<DbConnection, IIntegrationEventLogService> integrationEventLogServiceFactory)
        {
            _publisher = publisher;
            _logger = logger;
            _orderingContext = orderingContext ?? throw new ArgumentNullException(nameof(orderingContext));
            _integrationEventLogServiceFactory = integrationEventLogServiceFactory ?? throw new ArgumentNullException(nameof(integrationEventLogServiceFactory));
            _eventLogService = _integrationEventLogServiceFactory(_orderingContext.Database.GetDbConnection());
        }
        public async Task SaveEventAndOrderingContextChangesAsync(IntegrationEvent evt)
        {
            _logger.LogInformation("----- OrderingIntegrationEventService - Saving changes and integrationEvent: {IntegrationEventId}", evt.Id);

            //Use of an EF Core resiliency strategy when using multiple DbContexts within an explicit BeginTransaction():
            //See: https://docs.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency            
            await ResilientTransaction.New(_orderingContext).ExecuteAsync(async () =>
            {
                // Achieving atomicity between original ordering database operation and the IntegrationEventLog thanks to a local transaction
                await _orderingContext.SaveChangesAsync();
                await _eventLogService.SaveEventAsync(evt, _orderingContext.Database.CurrentTransaction);
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
