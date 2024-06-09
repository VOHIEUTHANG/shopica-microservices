using Ardalis.Specification.EntityFrameworkCore;
using Payment.API.Infrastructure.Data;
using Payment.API.Models;

namespace Payment.API.Infrastructure
{
    public class PaymentRepository<T> : RepositoryBase<T>, IPaymentRepository<T> where T : BaseEntity
    {
        private readonly PaymentDbContext _dbContext;
        public PaymentRepository(PaymentDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }
    }
}
