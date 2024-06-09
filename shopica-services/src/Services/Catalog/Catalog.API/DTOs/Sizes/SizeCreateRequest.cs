using System.ComponentModel.DataAnnotations;

namespace Catalog.API.DTOs.Sizes
{
    public class SizeCreateRequest
    {
        [Required]
        public string SizeName { get; set; }
    }
}
