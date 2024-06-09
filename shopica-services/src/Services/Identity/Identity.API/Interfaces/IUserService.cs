using Identity.API.DTOs.Addresses;
using Identity.API.DTOs.Users;

namespace Identity.API.Interfaces
{
    public interface IUserService
    {
        public Task<IEnumerable<UserResponse>> GetAllAsync();
        public Task<UserResponse> GetByIdAsync(int userId);
        public Task<UserResponse> CreateAsync(UserCreateRequest registerModel);
        public Task<UserResponse> UpdateAsync(UserUpdateRequest request);
        public Task<bool> DeleteAsync(int userId);
        public Task<UserResponse> CreateSUPERUserAsync(string username, string password);
        public Task<AddressResponse> GetStoreAddressAsync();
        public Task<int> GetTotalUserAsync();

    }
}
