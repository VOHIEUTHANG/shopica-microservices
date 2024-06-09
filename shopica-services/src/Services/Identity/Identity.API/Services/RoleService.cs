using AutoMapper;
using Identity.API.DTOs.Roles;
using Identity.API.Infrastructure.Data;
using Identity.API.Interfaces;
using Identity.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Identity.API.Services
{
    public class RoleService : IRoleService
    {
        private readonly IdentityDbContext _dbcontext;
        private readonly IMapper _mapper;
        public RoleService(
            IdentityDbContext dbcontext,
            IMapper mapper)
        {
            _dbcontext = dbcontext;
            _mapper = mapper;
        }

        public async Task<RoleResponse> CreateAsync(RoleCreateRequest request)
        {
            var roleExist = await _dbcontext.Roles.FirstOrDefaultAsync(r => r.RoleName == request.RoleName);
            if (roleExist is not null) throw new ArgumentException("Role name is already exist!");

            var role = new Role()
            {
                RoleName = request.RoleName,
                RoleDescription = request.RoleDescription,
            };
            await _dbcontext.Roles.AddAsync(role);
            await _dbcontext.SaveChangesAsync();
            return _mapper.Map<RoleResponse>(role);
        }

        public async Task<bool> DeleteAsync(int roleId)
        {
            var role = await _dbcontext.Roles.FirstOrDefaultAsync(r => r.Id == roleId);
            if (role is null) throw new ArgumentException($"Can not find role with key: {roleId}");

            _dbcontext.Roles.Remove(role);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<RoleResponse>> GetAllAsync()
        {
            var roles = await _dbcontext.Roles.ToListAsync();
            return _mapper.Map<IEnumerable<RoleResponse>>(roles);
        }

        public async Task<RoleResponse> GetByIdAsync(int roleId)
        {
            var role = await _dbcontext.Roles.FirstOrDefaultAsync(r => r.Id == roleId);
            if (role is null) throw new Exception($"Can not find role with Id: {roleId}");

            var result = _mapper.Map<RoleResponse>(role);

            return result;
        }

        public async Task<RoleResponse> UpdateAsync(RoleUpdateRequest request)
        {
            var role = await _dbcontext.Roles.FirstOrDefaultAsync(r => r.Id == request.Id);
            if (role is null) throw new ArgumentException($"Can not find role with key: {request.Id}");

            role.RoleName = request.RoleName ?? role.RoleName;
            role.RoleDescription = request.RoleDescription ?? role.RoleDescription;

            _dbcontext.Roles.Update(role);
            await _dbcontext.SaveChangesAsync();

            return _mapper.Map<RoleResponse>(role);
        }
    }
}
