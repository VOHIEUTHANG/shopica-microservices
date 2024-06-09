using Ardalis.Specification;
using Inventory.API.Models.Enums;

namespace Inventory.API.Specifications.WarehouseEntries
{
    public class WEFilteredSpec : Specification<WarehouseEntry>
    {
        public WEFilteredSpec(string? documentTypes, string? productName)
        {
            if (!string.IsNullOrEmpty(productName))
            {
                Query.Search(d => d.ProductName, "%" + productName + "%");
            }

            if (!string.IsNullOrEmpty(documentTypes))
            {
                var statusList = documentTypes.ToLower().Split(',').Select(s => (WarehouseEntrySourceDocument)Enum.Parse(typeof(WarehouseEntrySourceDocument), s));
                Query.Where(d => statusList.Contains(d.SourceDocument));
            }

            Query
             .AsNoTracking();
        }
    }
}
