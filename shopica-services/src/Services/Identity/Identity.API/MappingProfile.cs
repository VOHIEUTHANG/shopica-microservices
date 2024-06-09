using AutoMapper;
using Identity.API.DTOs.Addresses;
using Identity.API.DTOs.Roles;
using Identity.API.DTOs.Users;
using Identity.API.Models;

namespace Identity.API
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            DestinationMemberNamingConvention = new ExactMatchNamingConvention();

            CreateMap<Role, RoleResponse>();
            CreateMap<User, UserResponse>();
            CreateMap<Address, AddressResponse>();

            CreateMap<UserCreateRequest, User>();
            CreateMap<SocialLoginRequest, User>();
            CreateMap<AddressRequest, Address>();
        }
    }
}
