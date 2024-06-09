using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Payment.API.Infrastructure.Data.Config
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Models.Payment>
    {
        public void Configure(EntityTypeBuilder<Models.Payment> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(p => p.Amount).HasPrecision(18, 2);

            builder.Property(p => p.Id)
               .UseHiLo("paymetseq");

            builder.HasOne(p => p.PaymentMethod)
               .WithMany(pm => pm.Payments)
               .HasForeignKey(p => p.PaymentMethodId);
        }
    }
}
