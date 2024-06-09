using System.ComponentModel.DataAnnotations;

namespace Catalog.API.DTOs.Categories
{
    public class CategoryUpdateRequest
    {
        [Required]
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public string ImageUrl { get; set; }
    }
}
