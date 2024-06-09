using Ardalis.Specification.EntityFrameworkCore;
using Ratting.API.Infrastructure.Data;
using Ratting.API.Models;

namespace Ratting.API.Infrastructure
{
    public class RattingRepository<T> : RepositoryBase<T>, IRattingRepository<T> where T : BaseEntity
    {
        private readonly RattingDbContext _dbContext;
        public RattingRepository(RattingDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }
    }
}
