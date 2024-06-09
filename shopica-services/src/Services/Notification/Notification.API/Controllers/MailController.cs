using Microsoft.AspNetCore.Mvc;
using Notification.API.DTOs;
using Notification.API.DTOs.Emails;
using Notification.API.Interfaces;
using System.Net;

namespace Notification.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly IEmailService _mailService;
        private readonly IConfiguration _configuration;
        public MailController(IEmailService mailService, IConfiguration configuration)
        {
            _mailService = mailService;
            _configuration = configuration;
        }

        [HttpPost]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> GetAllAsync(MailData mailData)
        {
            var result = await _mailService.SendMailAsync(mailData);

            return Ok(new BaseSuccessResponse<bool>(result));
        }

        [HttpPost("contact")]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]

        public async Task<IActionResult> ContactAsync(ContactCreateRequest request)
        {

            MailData mailData = new MailData()
            {
                EmailToId = _configuration["MailSettings:AdminEmailAddress"],
                EmailSubject = $"Shopica - New contact from {request.Name} - {request.Email} - {request.Phone}",
                EmailBody = $"You have new contact from {request.Name} - {request.Email} - {request.Phone} with message:"
                 + Environment.NewLine + request.Message,
                EmailToName = "Admin"
            };

            var result = await _mailService.SendMailAsync(mailData);

            return Ok(new BaseSuccessResponse<bool>(result));
        }
    }
}
