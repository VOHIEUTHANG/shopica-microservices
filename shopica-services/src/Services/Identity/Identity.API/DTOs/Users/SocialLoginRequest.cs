namespace Identity.API.DTOs.Users
{
    public class SocialLoginRequest
    {
        public string Token { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string Provider { get; set; }
        public string ProviderKey { get; set; }
    }
}
