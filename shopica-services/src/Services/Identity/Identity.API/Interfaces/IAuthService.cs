using Identity.API.DTOs.Users;

namespace Identity.API.Interfaces
{
    public interface IAuthService
    {
        public Task<LoginResponse> AuthenticateAsync(LoginRequest loginModel);
        public Task<LoginResponse> SocialAuthenticateAsync(SocialLoginRequest request);
        public Task<bool> ChangePasswordAsync(ChangePasswordRequest request);
        public Task<bool> CheckExistsUsernameAsync(string username);
        public Task<bool> GenerateTokenResetPasswordAsync(string email);
        public Task<bool> ResetPasswordAsync(ResetPasswordRequest request);
    }
}
