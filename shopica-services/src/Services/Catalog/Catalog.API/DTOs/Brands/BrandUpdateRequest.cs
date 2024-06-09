using System.ComponentModel.DataAnnotations;

namespace Catalog.API.DTOs.Brands
{
    public class BrandUpdateRequest
    {
        [Required]
        public int Id { get; set; }
        public string BrandName { get; set; }
    }
}
