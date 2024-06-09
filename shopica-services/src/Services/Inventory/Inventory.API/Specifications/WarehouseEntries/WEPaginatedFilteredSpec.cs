using Ardalis.Specification;
using Inventory.API.Models.Enums;

namespace Inventory.API.Specifications.WarehouseEntries
{
    public class WEPaginatedFilteredSpec : Specification<WarehouseEntry>
    {
        public WEPaginatedFilteredSpec(BaseParam param, string? documentTypes, string? productName)
        {
            if (param.SortField == "id" && param.SortOrder == "descend")
            {
                Query.OrderByDescending(d => d.Id);
            }

            if (!string.IsNullOrEmpty(productName))
            {
                Query.Search(d => d.ProductName, "%" + productName + "%");
            }

            if (!string.IsNullOrEmpty(documentTypes))
            {
                var statusList = documentTypes.ToLower().Split(',').Select(s => (WarehouseEntrySourceDocument)Enum.Parse(typeof(WarehouseEntrySourceDocument), s));
                Query.Where(d => statusList.Contains(d.SourceDocument));
            }

            Query.Skip(param.PageSize * (param.PageIndex - 1))
             .Take(param.PageSize)
             .AsNoTracking();
        }
    }
}
