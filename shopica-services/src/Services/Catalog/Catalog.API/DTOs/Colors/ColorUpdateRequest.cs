using System.ComponentModel.DataAnnotations;

namespace Catalog.API.DTOs.Colors
{
    public class ColorUpdateRequest
    {
        public int Id { get; set; }
        [Required]
        public string ColorCode { get; set; }
        [Required]
        public string ColorName { get; set; }
    }
}
