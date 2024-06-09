using Ordering.API.DTOs;
using Ordering.API.DTOs.Addresses;

namespace Ordering.API.Interfaces
{
    public interface IAddressService
    {
        public Task<PaginatedResult<AddressResponse>> GetAllAsync(BaseParam param, int customerId);
        public Task<AddressResponse> GetByIdAsync(int addressId);
        public Task<AddressResponse> GetDefaultAddressAsync(int customerId);
        public Task<AddressResponse> CreateAsync(AddressCreateRequest request);
        public Task<AddressResponse> UpdateAsync(AddressUpdateRequest request);
        public Task<bool> DeleteAsync(int addressId);
    }
}
