using Microsoft.AspNetCore.Mvc;
using Storage.API.DTOs;
using Storage.API.Interfaces;
using System.Net;

namespace Storage.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AwsS3Controller : ControllerBase
    {
        private readonly IAwsS3Service _awsS3Service;
        public AwsS3Controller(IAwsS3Service awsS3Service)
        {
            _awsS3Service = awsS3Service;
        }

        [HttpGet("get-presigned-url")]
        [ProducesResponseType(typeof(BaseSuccessResponse<S3PresignedUrlResponse>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetS3PreSignedURL(string fileName, string folder, string contentType)
        {
            var response = await _awsS3Service.GetS3PreSignedURLAsync(fileName, folder, contentType);
            return Ok(new BaseSuccessResponse<S3PresignedUrlResponse>(response));
        }

        [HttpDelete]
        [ProducesResponseType(typeof(BaseSuccessResponse<bool>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteS3FileAsync(string fileKey)
        {
            var response = await _awsS3Service.DeleteS3FileAsync(fileKey);
            return Ok(new BaseSuccessResponse<bool>(response));
        }
    }
}
