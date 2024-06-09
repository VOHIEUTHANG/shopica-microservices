using Ardalis.Specification.EntityFrameworkCore;
using Basket.API.Infrastructure.Data;
using Basket.API.Models;

namespace Basket.API.Infrastructure
{
    public class BasketRepository<T> : RepositoryBase<T>, IBasketRepository<T> where T : BaseEntity
    {
        private readonly BasketDbContext _dbContext;
        public BasketRepository(BasketDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }
    }
}
