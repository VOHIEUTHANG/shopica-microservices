using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ordering.API.DTOs;
using Ordering.API.DTOs.OrderDetails;
using Ordering.API.DTOs.Orders;
using Ordering.API.Infrastructure;
using Ordering.API.IntegrationEvents.Events;
using Ordering.API.Interfaces;
using Ordering.API.Models;
using Ordering.API.Specifications.Orders;

namespace Ordering.API.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderingRepository<Order> _orderRepository;
        private readonly IOrderingRepository<OrderDetail> _orderDetailRepository;
        private readonly IOrderingRepository<Address> _addressRepository;
        private readonly IOrderingIntegrationEventService _integrationEventService;
        private readonly IMapper _mapper;
        public OrderService(
           IOrderingRepository<Order> orderRepository,
           IOrderingRepository<OrderDetail> orderDetailRepository,
           IOrderingRepository<Address> addressRepository,
           IOrderingIntegrationEventService eventService,
           IMapper mapper)
        {
            _orderRepository = orderRepository;
            _orderDetailRepository = orderDetailRepository;
            _addressRepository = addressRepository;
            _integrationEventService = eventService;
            _mapper = mapper;
        }
        public async Task<OrderResponse> CreateAsync(OrderCreateRequest request)
        {
            var order = _mapper.Map<Order>(request);

            if (request.SaveAddress)
            {
                var newAddress = _mapper.Map<Address>(request);
                await _addressRepository.AddAsync(newAddress);
            }

            await _orderRepository.AddAsync(order);

            var @event = new OrderCreatedIntegrationEvent(order.Id,
                request.CustomerId,
                order.CustomerName,
                order.CreatedAt,
                request.TotalPrice,
                _mapper.Map<List<OrderDetailIntegrationEvent>>(order.OrderDetails));

            await _integrationEventService.SaveEventAndOrderingContextChangesAsync(@event);

            await _integrationEventService.PublishThroughEventBusAsync(@event);

            return _mapper.Map<OrderResponse>(order);
        }

        public async Task<PaginatedResult<OrderResponse>> GetAllAsync(BaseParam param, int customerId, string? customerName, string? status)
        {
            var spec = new OrderPaginatedFilteredSpec(param, customerId, customerName, status);
            var orders = await _orderRepository.ListAsync(spec);
            var totalRecords = await _orderRepository.CountAsync(new OrderFilteredSpec(customerId, customerName, status));
            var ordersResponse = _mapper.Map<IEnumerable<OrderResponse>>(orders);
            return new PaginatedResult<OrderResponse>(param.PageIndex, param.PageSize, totalRecords, ordersResponse);
        }

        public async Task<List<ProductByCount>> GetBestSellerAsync()
        {
            var result = await _orderDetailRepository.GroupBy(od => od.ProductId)
            .Select(group => new ProductByCount
            {
                ProductId = group.Key,
                Count = group.Count()
            }).OrderByDescending(x => x.Count).ToListAsync();

            return result;
        }

        public async Task<OrderResponse> GetByIdAsync(int orderId)
        {
            var order = await _orderRepository.FirstOrDefaultAsync(new OrderByIdSpec(orderId));
            if (order is null) throw new ArgumentException($"Can not find order with key: {orderId}");
            var result = _mapper.Map<OrderResponse>(order);
            return result;
        }

        public async Task<List<ProductByColor>> GetProductByColorAsync()
        {
            var result = await _orderDetailRepository.GroupBy(od => od.ColorName)
             .Select(group => new ProductByColor
             {
                 ColorName = group.Key,
                 ProductCount = group.Sum(od => od.Quantity)
             }).OrderByDescending(pc => pc.ProductCount).ToListAsync();

            return result;
        }

        public async Task<List<ProductByRevenues>> GetProductRevenuesAsync()
        {
            var result = await _orderDetailRepository.GroupBy(od => od.ProductId)
             .Select(group => new ProductByRevenues
             {
                 ProductId = group.Key,
                 Revenues = group.Sum(od => od.Quantity * od.Price)
             }).ToListAsync();

            return result;
        }

        public async Task<decimal> GetTotalRevenuesAsync()
        {
            var totalRecords = await _orderRepository.SumAsync(o => o.TotalPrice);
            return totalRecords;
        }

        public async Task<int> GetTotalSalesOrderAsync()
        {
            var totalRecords = await _orderRepository.CountAsync();
            return totalRecords;
        }

        public async Task<OrderResponse> UpdateAsync(OrderUpdateRequest request)
        {
            var order = await _orderRepository.FirstOrDefaultAsync(new OrderByIdSpec(request.Id));
            if (order is null) throw new ArgumentException($"Can not find order with key: {request.Id}");

            order.Status = request.Status;

            await _orderRepository.UpdateAsync(order);
            await _orderRepository.SaveChangesAsync();

            return _mapper.Map<OrderResponse>(order);
        }
    }
}
