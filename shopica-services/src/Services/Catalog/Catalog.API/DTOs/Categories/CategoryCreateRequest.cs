using System.ComponentModel.DataAnnotations;

namespace Catalog.API.DTOs.Categories
{
    public class CategoryCreateRequest
    {
        [Required]
        public string CategoryName { get; set; }
        [Required]
        public string ImageUrl { get; set; }
    }
}
