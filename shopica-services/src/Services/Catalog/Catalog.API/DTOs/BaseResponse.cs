using System.Text.Json;

namespace Catalog.API.DTOs
{
    public class BaseResponse<T>
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }
        public T Data { get; set; }
        public override string ToString()
        {
            JsonSerializerOptions jsonSerializerOptions = new JsonSerializerOptions();
            jsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            return JsonSerializer.Serialize(this, jsonSerializerOptions);
        }
    }
}
