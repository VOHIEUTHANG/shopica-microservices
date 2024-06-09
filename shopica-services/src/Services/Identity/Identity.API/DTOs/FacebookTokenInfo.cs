namespace Identity.API.DTOs
{
    public class FacebookTokenInfo
    {
        public FacebookTokenData Data { get; set; }
    }
    public class FacebookTokenData
    {
        public long Expires_at { get; set; }
        public bool Is_valid { get; set; }
    }
}
