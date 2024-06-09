namespace Notification.API.DTOs
{
    public class BaseParam
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public string SortField { get; set; } = string.Empty;
        public string SortOrder { get; set; } = string.Empty;
    }
}
