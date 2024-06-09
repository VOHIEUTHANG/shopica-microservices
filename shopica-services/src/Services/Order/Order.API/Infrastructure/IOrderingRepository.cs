using Ardalis.Specification;
using Ordering.API.Models;
using System.Linq.Expressions;

namespace Ordering.API.Infrastructure
{
    public interface IOrderingRepository<T> : IRepositoryBase<T> where T : BaseEntity
    {
        public IQueryable<IGrouping<Tkey, T>> GroupBy<Tkey>(Expression<Func<T, Tkey>> keySelector);
        public Task<decimal> SumAsync(Expression<Func<T, decimal>> selector, CancellationToken cancellationToken = default);
    }
}
