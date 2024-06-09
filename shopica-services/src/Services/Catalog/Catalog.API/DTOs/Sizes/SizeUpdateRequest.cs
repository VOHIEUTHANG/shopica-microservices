using System.ComponentModel.DataAnnotations;

namespace Catalog.API.DTOs.Sizes
{
    public class SizeUpdateRequest
    {
        [Required]
        public int Id { get; set; }
        public string SizeName { get; set; }
    }
}
