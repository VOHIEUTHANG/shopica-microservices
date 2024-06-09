using System.ComponentModel.DataAnnotations;

namespace Catalog.API.DTOs.Brands
{
    public class BrandCreateRequest
    {
        [Required]
        public string BrandName { get; set; }
    }
}
