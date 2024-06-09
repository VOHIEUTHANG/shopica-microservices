using Ardalis.Specification.EntityFrameworkCore;
using Catalog.API.Infrastructure.Data;
using Catalog.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Catalog.API.Infrastructure
{
    public class CatalogRepository<T> : RepositoryBase<T>, ICatalogRepository<T> where T : BaseEntity
    {
        private readonly CatalogDbContext _dbContext;
        public CatalogRepository(CatalogDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<IGrouping<Tkey, T>> GroupBy<Tkey>(Expression<Func<T, Tkey>> keySelector)
        {
            return _dbContext.Set<T>().GroupBy(keySelector);
        }
    }
}
