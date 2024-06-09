using Amazon.S3;
using Amazon.S3.Model;
using Storage.API.DTOs;
using Storage.API.Interfaces;

namespace Storage.API.Services
{
    public class AwsS3Service : IAwsS3Service
    {
        private readonly IAmazonS3 _S3Client;
        private readonly IConfiguration _configuration;
        public AwsS3Service(IAmazonS3 S3Client, IConfiguration configuration)
        {
            _S3Client = S3Client;
            _configuration = configuration;
        }
        public async Task<bool> DeleteS3FileAsync(string awsFileKey)
        {
            var bucketName = _configuration["AWS:S3:BucketName"];
            var deleteObjectRequest = new DeleteObjectRequest
            {
                BucketName = bucketName,
                Key = awsFileKey,

            };

            await _S3Client.DeleteObjectAsync(deleteObjectRequest);

            return true;
        }

        public Task<S3PresignedUrlResponse> GetS3PreSignedURLAsync(string fileName, string folder, string contentType)
        {
            var bucketName = _configuration["AWS:S3:BucketName"];
            var region = Amazon.RegionEndpoint.APSoutheast1.SystemName;
            //var awsFileName = Guid.NewGuid().ToString() + "." + fileName.Split(".").Last();

            GetPreSignedUrlRequest request = new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = folder + "/" + fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.Now.AddDays(10),
                ContentType = contentType
            };
            var fileUrl = $"https://{bucketName}.s3.{region}.amazonaws.com/{folder}/{fileName}";
            string uploadUrl = _S3Client.GetPreSignedURL(request);

            var response = new S3PresignedUrlResponse()
            {
                UploadUrl = uploadUrl,
                FileUrl = fileUrl,
                AwsFileKey = folder + "/" + fileName,
            };

            return Task.FromResult(response);
        }
    }
}
