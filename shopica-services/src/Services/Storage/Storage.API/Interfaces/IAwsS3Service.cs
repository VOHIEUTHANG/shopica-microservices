using Storage.API.DTOs;

namespace Storage.API.Interfaces
{
    public interface IAwsS3Service
    {
        public Task<S3PresignedUrlResponse> GetS3PreSignedURLAsync(string fileName, string folder, string contentType);
        public Task<bool> DeleteS3FileAsync(string awsFileKey);
    }
}
