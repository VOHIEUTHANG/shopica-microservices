using AutoMapper;
using CryptoHelper;
using Identity.API.DTOs.Addresses;
using Identity.API.DTOs.Users;
using Identity.API.Infrastructure.Data;
using Identity.API.Interfaces;
using Identity.API.Models;
using Identity.API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Identity.API.Services
{
    public class UserService : IUserService
    {
        private readonly IdentityDbContext _dbcontext;
        private readonly IMapper _mapper;
        public UserService(
          IdentityDbContext dbContext,
            IMapper mapper)
        {
            _dbcontext = dbContext;
            _mapper = mapper;
        }

        public async Task<UserResponse> CreateAsync(UserCreateRequest request)
        {
            var userExist = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (userExist is not null) throw new ArgumentException("Username is already exist!");


            var user = _mapper.Map<User>(request);
            user.Password = Crypto.HashPassword(request.Password);
            user.Provider = UserProviders.SHOPICA;
            user.ProviderKey = UserProviders.SHOPICA;
            user.IsActive = true;

            if (request.RoleId == 0)
            {
                var role = await _dbcontext.Roles.FirstOrDefaultAsync(r => r.RoleName == RoleNames.DEFAULT);
                if (role is null)
                {
                    var newRole = new Role()
                    {
                        RoleName = RoleNames.DEFAULT,
                        RoleDescription = RoleNames.DEFAULT + " system generated",
                    };
                    await _dbcontext.Roles.AddAsync(newRole);
                    await _dbcontext.SaveChangesAsync();
                    user.RoleId = newRole.Id;
                }
                else
                {
                    user.RoleId = role.Id;
                }
            }

            await _dbcontext.Users.AddAsync(user);
            await _dbcontext.SaveChangesAsync();

            var userResponse = _mapper.Map<UserResponse>(user);
            userResponse.RoleName = RoleNames.DEFAULT;

            return userResponse;
        }
        public async Task<bool> DeleteAsync(int userId)
        {
            var user = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user is null) throw new ArgumentException($"Can not find user with key: {userId}");

            _dbcontext.Users.Remove(user);
            await _dbcontext.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<UserResponse>> GetAllAsync()
        {
            var users = await _dbcontext.Users.Include(u => u.Addresses).ToListAsync();
            var response = _mapper.Map<IEnumerable<UserResponse>>(users);
            return response;
        }

        public async Task<UserResponse> GetByIdAsync(int userId)
        {
            var user = await _dbcontext.Users.Include(u => u.Addresses).FirstOrDefaultAsync(u => u.Id == userId);
            if (user is null) throw new ArgumentException($"Can not find user with key: {userId}");
            return _mapper.Map<UserResponse>(user);
        }

        public async Task<UserResponse> UpdateAsync(UserUpdateRequest request)
        {
            var user = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Id == request.Id);
            if (user is null) throw new ArgumentException($"Can not find user with key: {request.Id}");

            user.Email = request.Email ?? user.Email;
            user.FullName = request.FullName ?? user.FullName;
            user.Phone = request.Phone ?? user.Phone;
            user.ImageUrl = request.ImageUrl ?? user.ImageUrl;
            user.IsActive = request.IsActive;
            user.Gender = request.Gender;

            var firstAddress = request.Addresses.FirstOrDefault();

            if (firstAddress != null)
            {
                var address = await _dbcontext.Addresses.FirstOrDefaultAsync(a => a.Id == firstAddress.Id);

                if (address is null)
                {
                    var newAddess = _mapper.Map<Address>(firstAddress);
                    user.Addresses = new List<Address>()
                {
                    newAddess
                };
                }
                else
                {
                    address.ProvinceId = firstAddress.ProvinceId;
                    address.ProvinceName = firstAddress.ProvinceName;
                    address.DistrictId = firstAddress.DistrictId;
                    address.DistrictName = firstAddress.DistrictName;
                    address.WardCode = firstAddress.WardCode;
                    address.WardName = firstAddress.WardName;
                    address.Street = firstAddress.Street;
                    address.FullAddress = firstAddress.FullAddress;
                    _dbcontext.Addresses.Update(address);
                }

            }

            _dbcontext.Users.Update(user);
            await _dbcontext.SaveChangesAsync();
            return _mapper.Map<UserResponse>(user);
        }

        public async Task<UserResponse> CreateSUPERUserAsync(string username, string password)
        {
            var user = new User()
            {
                Username = username,
                FullName = string.Empty,
                Password = Crypto.HashPassword(password),
                Email = string.Empty,
                IsActive = true,
                ImageUrl = string.Empty,
                Phone = string.Empty,
                Provider = UserProviders.SHOPICA,
                ProviderKey = UserProviders.SHOPICA,
                Role = new Role()
                {
                    RoleName = RoleNames.SUPER,
                    RoleDescription = "SUPER Role",
                }
            };

            await _dbcontext.Users.AddAsync(user);
            await _dbcontext.SaveChangesAsync();

            var userResponse = _mapper.Map<UserResponse>(user);
            var role = await _dbcontext.Roles.FirstOrDefaultAsync(r => r.Id == user.RoleId);
            userResponse.RoleName = role.RoleName;

            return userResponse;
        }

        public async Task<AddressResponse> GetStoreAddressAsync()
        {
            var storeUser = await _dbcontext.Users.Where(u => u.Role.RoleName == RoleNames.SUPER)
                 .Include(u => u.Addresses)
                 .FirstOrDefaultAsync();

            return _mapper.Map<AddressResponse>(storeUser.Addresses.FirstOrDefault());
        }

        public async Task<int> GetTotalUserAsync()
        {
            var result = await _dbcontext.Users.CountAsync(u => u.IsActive);
            return result;
        }
    }
}
