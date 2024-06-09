using Ardalis.Specification;
using Catalog.API.Models;
using System.Linq.Expressions;

namespace Catalog.API.Infrastructure
{
    public interface ICatalogRepository<T> : IRepositoryBase<T> where T : BaseEntity
    {
        public IQueryable<IGrouping<Tkey, T>> GroupBy<Tkey>(Expression<Func<T, Tkey>> keySelector);
    }
}
