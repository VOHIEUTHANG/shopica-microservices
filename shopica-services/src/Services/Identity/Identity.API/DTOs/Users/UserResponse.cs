using Identity.API.DTOs.Addresses;
using Identity.API.Models.Enums;

namespace Identity.API.DTOs.Users
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public Gender Gender { get; set; }
        public bool IsActive { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string ImageUrl { get; set; }
        public IEnumerable<AddressResponse> Addresses { get; set; }
    }
}
