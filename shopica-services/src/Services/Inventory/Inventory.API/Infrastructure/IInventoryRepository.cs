using Ardalis.Specification;
using System.Linq.Expressions;

namespace Inventory.API.Infrastructure
{
    public interface IInventoryRepository<T> : IRepositoryBase<T> where T : BaseEntity
    {
        public Task<int> SumAsync(ISpecification<T> specification, Expression<Func<T, int>> selector, CancellationToken cancellationToken = default);
    }
}
