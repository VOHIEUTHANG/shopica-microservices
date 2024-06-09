using Identity.API.DTOs;
using Identity.API.DTOs.Addresses;
using Identity.API.DTOs.Users;
using Identity.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace Identity.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;
        public UsersController(IUserService userService, IAuthService authService)
        {
            _userService = userService;
            _authService = authService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<IEnumerable<UserResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync()
        {
            var result = await _userService.GetAllAsync();

            return Ok(new BaseSuccessResponse<IEnumerable<UserResponse>>(result));
        }
        [HttpGet("{userId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<UserResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetByIdAsync(int userId)
        {
            var result = await _userService.GetByIdAsync(userId);

            return Ok(new BaseSuccessResponse<UserResponse>(result));
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(BaseSuccessResponse<LoginResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> AuthenticateAsync(LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _authService.AuthenticateAsync(request);

            return Ok(new BaseSuccessResponse<LoginResponse>(result));
        }
        [HttpPost("social-login")]
        [ProducesResponseType(typeof(BaseSuccessResponse<LoginResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> SocialAuthenticateAsync(SocialLoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _authService.SocialAuthenticateAsync(request);

            return Ok(new BaseSuccessResponse<LoginResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<UserResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(UserCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _userService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<UserResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<UserResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(UserUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _userService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<UserResponse>(result));
        }
        [HttpDelete("{userId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> DeleteAsync(int userId)
        {
            var result = await _userService.DeleteAsync(userId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }

        [HttpGet("check-exists")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> CheckExistsUsernameAsync(string username)
        {
            var result = await _authService.CheckExistsUsernameAsync(username);

            return Ok(new BaseSuccessResponse<bool>(result));
        }

        [HttpPost("create-super")]
        [ProducesResponseType(typeof(BaseSuccessResponse<UserResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateSUPERUserAsync(LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.CreateSUPERUserAsync(request.Username, request.Password);

            return Ok(new BaseSuccessResponse<UserResponse>(result));
        }

        [HttpPost("change-password")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> ChangePasswordAsync(ChangePasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.ChangePasswordAsync(request);

            return Ok(new BaseSuccessResponse<bool>(result));
        }

        [HttpGet("get-store-address")]
        [ProducesResponseType(typeof(BaseSuccessResponse<AddressResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetStoreAddressAsync()
        {
            var result = await _userService.GetStoreAddressAsync();

            return Ok(new BaseSuccessResponse<AddressResponse>(result));
        }

        [HttpGet("generate-token-reset-password")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> GenerateTokenResetPassword([FromQuery] string email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.GenerateTokenResetPasswordAsync(email);

            return Ok(new BaseSuccessResponse<bool>(result));
        }

        [HttpPost("reset-password")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.ResetPasswordAsync(request);

            return Ok(new BaseSuccessResponse<bool>(result));
        }
        [HttpGet("get-total-users")]
        [ProducesResponseType(typeof(BaseSuccessResponse<int>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> GetTotalUserAsync()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.GetTotalUserAsync();

            return Ok(new BaseSuccessResponse<int>(result));
        }
    }
}
