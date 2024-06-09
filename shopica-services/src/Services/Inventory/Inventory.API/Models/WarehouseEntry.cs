using Inventory.API.Models.Enums;

namespace Inventory.API.Models
{
    public class WarehouseEntry : BaseEntity
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int ColorId { get; set; }
        public string ColorName { get; set; }
        public int SizeId { get; set; }
        public string SizeName { get; set; }
        public int Quantity { get; set; }
        public WarehouseEntrySourceDocument SourceDocument { get; set; }
        public int SourceNo { get; set; }
        public int SourceLineNo { get; set; }
        public DateTime RegisteringDate { get; set; }
    }
}
