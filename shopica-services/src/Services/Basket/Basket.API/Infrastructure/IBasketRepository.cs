using Ardalis.Specification;
using Basket.API.Models;

namespace Basket.API.Infrastructure
{
    public interface IBasketRepository<T> : IRepositoryBase<T> where T : BaseEntity
    {
    }
}
