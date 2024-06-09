using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Inventory.API.Infrastructure
{
    public class InventoryRepository<T> : RepositoryBase<T>, IInventoryRepository<T> where T : BaseEntity
    {
        private readonly InventoryDbContext _dbContext;
        public InventoryRepository(InventoryDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<int> SumAsync(ISpecification<T> specification, Expression<Func<T, int>> selector, CancellationToken cancellationToken = default)
        {
            return await ApplySpecification(specification, true).SumAsync(selector, cancellationToken);
        }
    }
}
