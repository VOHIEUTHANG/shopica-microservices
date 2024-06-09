using Identity.API.DTOs;
using Identity.API.DTOs.Roles;
using Identity.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace Identity.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _roleService;
        public RolesController(IRoleService roleService)
        {
            _roleService = roleService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<IEnumerable<RoleResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync()
        {
            var result = await _roleService.GetAllAsync();

            return Ok(new BaseSuccessResponse<IEnumerable<RoleResponse>>(result));
        }
        [HttpGet("{roleId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<RoleResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(int roleId)
        {
            var result = await _roleService.GetByIdAsync(roleId);

            return Ok(new BaseSuccessResponse<RoleResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<RoleResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> CreateAsync(RoleCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _roleService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<RoleResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<RoleResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(RoleUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _roleService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<RoleResponse>(result));
        }
        [HttpDelete("{roleId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync(int roleId)
        {
            var result = await _roleService.DeleteAsync(roleId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }

    }
}
