using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ordering.API.Models;

namespace Ordering.API.Infrastructure.Data.Config
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.TotalPrice).HasPrecision(18, 2);
            builder.Property(p => p.Discount).HasPrecision(18, 2);

            builder.Property(p => p.Id)
                .UseHiLo("orderseq");
        }
    }
}
