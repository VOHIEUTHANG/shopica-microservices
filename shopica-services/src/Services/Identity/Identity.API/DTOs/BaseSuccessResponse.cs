namespace Identity.API.DTOs
{
    public class BaseSuccessResponse<T> : BaseResponse<T>
    {
        public BaseSuccessResponse(T data)
        {
            IsSuccess = true;
            Data = data;
        }
    }
}
