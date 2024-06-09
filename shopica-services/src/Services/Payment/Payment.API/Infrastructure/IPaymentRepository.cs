using Ardalis.Specification;
using Payment.API.Models;

namespace Payment.API.Infrastructure
{
    public interface IPaymentRepository<T> : IRepositoryBase<T> where T : BaseEntity
    {
    }
}
