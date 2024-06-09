using Basket.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Basket.API.Infrastructure.Data.Config
{
    public class PromotionResultConfiguration : IEntityTypeConfiguration<PromotionResult>
    {
        public void Configure(EntityTypeBuilder<PromotionResult> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(p => p.PromotionAmount).HasPrecision(18, 2);
            builder.Property(p => p.PromotionDiscount).HasPrecision(18, 2);
            builder.Property(p => p.PromotionPrice).HasPrecision(18, 2);

            builder.Property(p => p.Id)
               .UseHiLo("promotionresultseq");
        }
    }
}
