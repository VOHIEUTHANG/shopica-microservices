namespace Storage.API.DTOs
{
    public class S3PresignedUrlResponse
    {
        public string UploadUrl { get; set; }
        public string FileUrl { get; set; }
        public string AwsFileKey { get; set; }
    }
}
