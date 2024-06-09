using Identity.API.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace Identity.API.DTOs.Users
{
    public class UserCreateRequest
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public string Email { get; set; } = string.Empty;
        public Gender Gender { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int RoleId { get; set; }
    }
}
