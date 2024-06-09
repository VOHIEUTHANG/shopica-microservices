using Ardalis.Specification;

namespace Inventory.API.Specifications.WarehouseEntries
{
    public class WEByProductSpec : Specification<WarehouseEntry, string?>
    {
        public WEByProductSpec(int productId, int colorId, int sizeId)
        {
            Query.Where(p => p.ProductId == productId && p.SizeId == sizeId && p.ColorId == colorId)
                .AsNoTracking();
        }
    }
}
