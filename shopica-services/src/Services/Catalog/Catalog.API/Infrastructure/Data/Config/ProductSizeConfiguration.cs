using Catalog.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Catalog.API.Infrastructure.Data.Config
{
    public class ProductSizeConfiguration : IEntityTypeConfiguration<ProductSize>
    {
        public void Configure(EntityTypeBuilder<ProductSize> builder)
        {
            builder.HasKey(pi => new { pi.ProductId, pi.SizeId });

            builder.HasOne(pi => pi.Product)
                .WithMany(p => p.ProductSizes)
                .HasForeignKey(pi => pi.ProductId);

            builder.HasOne(pi => pi.Size)
                .WithMany(p => p.ProductSizes)
                .HasForeignKey(pi => pi.SizeId);
        }
    }
}
