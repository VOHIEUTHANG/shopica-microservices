using Catalog.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Catalog.API.Infrastructure.Data.Config
{
    public class ProductColorConfiguration : IEntityTypeConfiguration<ProductColor>
    {
        public void Configure(EntityTypeBuilder<ProductColor> builder)
        {
            builder.HasKey(pi => new { pi.ProductId, pi.ColorId });

            builder.HasOne(pi => pi.Product)
                .WithMany(p => p.ProductColors)
                .HasForeignKey(pi => pi.ProductId);

            builder.HasOne(pi => pi.Color)
                .WithMany(p => p.ProductColors)
                .HasForeignKey(pi => pi.ColorId);
        }
    }
}
