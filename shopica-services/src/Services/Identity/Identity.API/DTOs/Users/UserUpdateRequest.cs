using Identity.API.DTOs.Addresses;
using Identity.API.Models.Enums;

namespace Identity.API.DTOs.Users
{
    public class UserUpdateRequest
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public Gender Gender { get; set; }
        public bool IsActive { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public IEnumerable<AddressRequest> Addresses { get; set; }
    }
}
