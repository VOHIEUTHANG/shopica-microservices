using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Inventory.API.Infrastructure.Data.Config
{
    public class PurchaseOrderDetailConfiguration : IEntityTypeConfiguration<PurchaseOrderDetail>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrderDetail> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(p => p.Price).HasPrecision(18, 2);

            builder.Property(p => p.Id)
               .UseHiLo("purchaseorderdetailseq");

            builder.HasOne(od => od.PurchaseOrder)
               .WithMany(o => o.PurchaseOrderDetails)
               .HasForeignKey(od => od.PurchaseOrderId);
        }
    }
}
