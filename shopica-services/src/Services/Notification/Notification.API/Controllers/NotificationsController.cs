using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Notification.API.DTOs;
using Notification.API.DTOs.Notifications;
using Notification.API.Interfaces;
using System.Net;

namespace Notification.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }
        [HttpGet]
        [ProducesResponseType(typeof(BaseSuccessResponse<PaginatedResult<NotificationResponse>>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync([FromQuery] BaseParam param, string sourceEvents)
        {
            var result = await _notificationService.GetAllAsync(param, sourceEvents);

            return Ok(new BaseSuccessResponse<PaginatedResult<NotificationResponse>>(result));
        }

        [HttpGet("{notificationId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<NotificationResponse>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAsync(string notificationId)
        {
            var result = await _notificationService.GetByIdAsync(notificationId);

            return Ok(new BaseSuccessResponse<NotificationResponse>(result));
        }
        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<NotificationResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> AddAsync(NotificationCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _notificationService.CreateAsync(request);

            return Ok(new BaseSuccessResponse<NotificationResponse>(result));
        }
        [HttpPatch]
        [ProducesResponseType(typeof(BaseSuccessResponse<NotificationResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]

        public async Task<IActionResult> UpdateAsync(NotificationUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _notificationService.UpdateAsync(request);

            return Ok(new BaseSuccessResponse<NotificationResponse>(result));
        }
        [HttpDelete("{notificationId}")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteAsync(string notificationId)
        {
            var result = await _notificationService.DeleteAsync(notificationId);

            return Ok(new BaseSuccessResponse<bool>(result));
        }

        [HttpGet("update-read-notification")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateReadNotificationAsync()
        {
            var result = await _notificationService.UpdateReadNotificationAsync();

            return Ok(new BaseSuccessResponse<bool>(result));
        }
    }
}
