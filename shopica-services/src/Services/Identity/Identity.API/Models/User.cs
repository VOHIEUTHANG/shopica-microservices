using Identity.API.Models.Enums;

namespace Identity.API.Models
{
    public class User : BaseEntity
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string ImageUrl { get; set; }
        public string Email { get; set; }
        public Gender Gender { get; set; }
        public bool IsActive { get; set; }
        public string Provider { get; set; }
        public string ProviderKey { get; set; }
        public string? TokenResetPassword { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; }
        public IEnumerable<Address> Addresses { get; set; }
    }
}
