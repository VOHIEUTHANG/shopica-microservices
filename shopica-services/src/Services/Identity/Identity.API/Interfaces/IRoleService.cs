using Identity.API.DTOs.Roles;

namespace Identity.API.Interfaces
{
    public interface IRoleService
    {
        public Task<IEnumerable<RoleResponse>> GetAllAsync();
        public Task<RoleResponse> GetByIdAsync(int roleId);
        public Task<RoleResponse> CreateAsync(RoleCreateRequest request);
        public Task<RoleResponse> UpdateAsync(RoleUpdateRequest request);
        public Task<bool> DeleteAsync(int roleId);
    }
}
