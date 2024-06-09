using Basket.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Basket.API.Infrastructure.Data.Config
{
    public class PromotionConfiguration : IEntityTypeConfiguration<Promotion>
    {
        public void Configure(EntityTypeBuilder<Promotion> builder)
        {
            builder.HasKey(p => p.Code);

            builder.Property(p => p.PromotionAmount).HasPrecision(18, 2);
            builder.Property(p => p.PromotionDiscount).HasPrecision(18, 2);
            builder.Property(p => p.PromotionPrice).HasPrecision(18, 2);
        }
    }
}
