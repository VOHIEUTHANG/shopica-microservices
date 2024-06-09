using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Inventory.API.Infrastructure.Data.Config
{
    public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.TotalPrice).HasPrecision(18, 2);

            builder.Property(p => p.Id)
                .UseHiLo("purchaseorderseq");
        }
    }
}
