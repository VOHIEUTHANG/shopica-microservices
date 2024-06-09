using Ardalis.Specification;
using Ratting.API.Models;

namespace Ratting.API.Infrastructure
{
    public interface IRattingRepository<T> : IRepositoryBase<T> where T : BaseEntity
    {
    }
}
