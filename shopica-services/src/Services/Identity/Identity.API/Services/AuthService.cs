using AutoMapper;
using CryptoHelper;
using Identity.API.DTOs;
using Identity.API.DTOs.Users;
using Identity.API.Infrastructure.Data;
using Identity.API.IntegrationEvents.Events;
using Identity.API.Interfaces;
using Identity.API.Models;
using Identity.API.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace Identity.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IdentityDbContext _dbcontext;
        private readonly IIdentityIntegrationEventService _integrationEventService;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        public AuthService(
          IdentityDbContext dbContext,
          IIdentityIntegrationEventService integrationEventService,
            IConfiguration configuration,
            IMapper mapper)
        {
            _dbcontext = dbContext;
            _integrationEventService = integrationEventService;
            _configuration = configuration;
            _mapper = mapper;
        }

        public async Task<LoginResponse> AuthenticateAsync(LoginRequest loginModel)
        {
            var user = await _dbcontext.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Username == loginModel.Username);
            if (user is null) throw new KeyNotFoundException("Username not found");
            if (!Crypto.VerifyHashedPassword(user.Password, loginModel.Password))
            {
                throw new ArgumentException("Username or Password is incorrect!");
            }

            return CreateToken(user);
        }

        public async Task<bool> ChangePasswordAsync(ChangePasswordRequest request)
        {
            var user = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Id == request.Id);
            if (user is null) throw new ArgumentException($"Can not find user with key: {request.Id}");
            if (!Crypto.VerifyHashedPassword(user.Password, request.CurrentPassword))
            {
                throw new ArgumentException("Current Password is incorrect!");
            }
            user.Password = Crypto.HashPassword(request.NewPassword);

            _dbcontext.Users.Update(user);
            await _dbcontext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> CheckExistsUsernameAsync(string username)
        {
            var userExist = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (userExist is not null) return true;
            return false;
        }

        public async Task<LoginResponse> SocialAuthenticateAsync(SocialLoginRequest request)
        {
            if (!(await VerifyTokenAsync(request.Provider, request.Token)))
            {
                throw new ArgumentException("Token is invalid!");
            }

            var user = await _dbcontext.Users
                  .Include(u => u.Role)
                  .FirstOrDefaultAsync(u => u.Email == request.Email && u.Provider == request.Provider);

            if (user is null)
            {
                var newUser = _mapper.Map<User>(request);
                newUser.Username = request.Email;
                newUser.Password = string.Empty;
                newUser.IsActive = true;

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
                    newUser.RoleId = newRole.Id;
                }
                else
                {
                    newUser.RoleId = role.Id;
                }
                await _dbcontext.Users.AddAsync(newUser);
                await _dbcontext.SaveChangesAsync();

                return CreateToken(newUser);
            }

            return CreateToken(user);
        }

        private async Task<bool> VerifyTokenAsync(string provider, string token)
        {
            switch (provider)
            {
                case UserProviders.FACEBOOK:
                    return await VerifyFacebookTokenAsync(token, _configuration["Authentication:Facebook:AppId"], _configuration["Authentication:Facebook:AppSecret"]);
                case UserProviders.GOOGLE:
                    return await VerifyGoogleTokenAsync(token, _configuration["Authentication:Google:ClientId"]);
                default:
                    break;
            }
            return false;
        }

        private async Task<bool> VerifyGoogleTokenAsync(string token, string clientId)
        {
            const string GoogleTokenInfoUrl = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={0}";
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(string.Format(GoogleTokenInfoUrl, token));
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    var tokenInfo = JsonSerializer.Deserialize<GoogleTokenInfo>(jsonResponse, options);
                    if (tokenInfo.Aud == clientId && tokenInfo.Iss == "https://accounts.google.com" && long.Parse(tokenInfo.Exp) > DateTimeOffset.UtcNow.ToUnixTimeSeconds())
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        private async Task<bool> VerifyFacebookTokenAsync(string token, string appId, string appSecret)
        {
            const string FacebookGraphApiUrl = "https://graph.facebook.com/debug_token?input_token={0}&access_token={1}";
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(string.Format(FacebookGraphApiUrl, token, $"{appId}|{appSecret}"));
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    var tokenInfo = JsonSerializer.Deserialize<FacebookTokenInfo>(jsonResponse, options);
                    if (tokenInfo.Data.Is_valid && tokenInfo.Data.Expires_at > DateTimeOffset.UtcNow.ToUnixTimeSeconds())
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        private LoginResponse CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim("username", user.Username),
                new Claim(ClaimTypes.Role, user.Role.RoleName),
                new Claim("imageUrl", user.ImageUrl),
                new Claim("roleId", user.Role.Id.ToString()),
                new Claim("userId", user.Id.ToString()),
                new Claim("roleName",  user.Role.RoleName),
            };
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Authentication:Jwt:Key"]));

            var expirationTimeStamp = DateTime.Now.AddHours(_configuration.GetSection("Authentication:Jwt:ExpireTime").Get<int>());

            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration["Authentication:Jwt:Issuer"],
                audience: _configuration["Authentication:Jwt:Audience"],
                claims: claims,
                expires: expirationTimeStamp,
                signingCredentials: new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha512)
            );

            return new LoginResponse
            {
                Token = new JwtSecurityTokenHandler().WriteToken(tokenOptions),
                ExpiresIn = (int)expirationTimeStamp.Subtract(DateTime.Now).TotalSeconds
            };
        }

        public async Task<bool> GenerateTokenResetPasswordAsync(string email)
        {
            var user = await _dbcontext.Users.FirstOrDefaultAsync(ac => ac.Email == email && ac.Provider == UserProviders.SHOPICA);
            if (user is null)
            {
                throw new Exception("Can not found user with this email!");
            }

            var token = Convert.ToBase64String(Encoding.UTF8.GetBytes(DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString()));

            user.TokenResetPassword = token;

            var redirectUrl = String.Format("{0}/account/reset?token={1}", _configuration["ClientUrl"], token);

            var @event = new ResetPasswordLinkGeneratedIntegrationEvent(email, user.FullName, redirectUrl);

            await _integrationEventService.SaveEventAndIdentityContextChangesAsync(@event);
            await _integrationEventService.PublishThroughEventBusAsync(@event);

            return true;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordRequest request)
        {
            var user = await _dbcontext.Users.FirstOrDefaultAsync(ac => ac.Email == request.Email && ac.Provider == UserProviders.SHOPICA);
            if (user == null)
            {
                throw new Exception("Can not found user with this email!");
            }
            var tokenGenerateTime = Convert.ToInt64(Encoding.UTF8.GetString(Convert.FromBase64String(request.ResetToken)));
            var currentTime = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            if (currentTime - tokenGenerateTime > long.Parse(_configuration["ResetTokenExpireTime"])) // 10 minutes
            {
                throw new Exception("Token is expired!");
            }

            if (String.Compare(user.TokenResetPassword, request.ResetToken) == 0)
            {
                user.Password = Crypto.HashPassword(request.NewPassword);
                user.TokenResetPassword = String.Empty;

                await _dbcontext.SaveChangesAsync();
                return true;
            }

            throw new Exception("Token is invalid!");
        }
    }
}
