namespace Notification.API.DTOs
{
    public class BaseErrorMessage<T> : BaseResponse<T>
    {
        public BaseErrorMessage(string errorMessage)
        {
            IsSuccess = false;
            ErrorMessage = errorMessage;
        }
    }
}
