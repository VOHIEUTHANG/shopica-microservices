namespace Identity.API.DTOs.Users
{
    public class ResetPasswordRequest
    {
        public string Email { get; set; }
        public string ResetToken { get; set; }
        public string NewPassword { get; set; }
    }
}
