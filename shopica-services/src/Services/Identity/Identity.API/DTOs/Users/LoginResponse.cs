namespace Identity.API.DTOs.Users
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public int ExpiresIn { get; set; }
    }
}
