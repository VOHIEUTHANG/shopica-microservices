using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Inventory.API.Infrastructure.Data.Config
{
    public class WarehouseEntryConfiguration : IEntityTypeConfiguration<WarehouseEntry>
    {
        public void Configure(EntityTypeBuilder<WarehouseEntry> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(p => p.Id)
               .UseHiLo("warehouseentryseq");
        }
    }
}
