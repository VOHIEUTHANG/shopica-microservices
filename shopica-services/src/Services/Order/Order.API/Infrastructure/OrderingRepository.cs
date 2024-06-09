using Ardalis.Specification.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Ordering.API.Infrastructure.Data;
using Ordering.API.Models;
using System.Linq.Expressions;

namespace Ordering.API.Infrastructure
{
    public class OrderingRepository<T> : RepositoryBase<T>, IOrderingRepository<T> where T : BaseEntity
    {
        private readonly OrderingDbContext _dbContext;
        public OrderingRepository(OrderingDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<IGrouping<Tkey, T>> GroupBy<Tkey>(Expression<Func<T, Tkey>> keySelector)
        {
            return _dbContext.Set<T>().GroupBy(keySelector);
        }

        public Task<decimal> SumAsync(Expression<Func<T, decimal>> selector, CancellationToken cancellationToken = default)
        {
            return _dbContext.Set<T>().SumAsync(selector, cancellationToken);
        }
    }
}
