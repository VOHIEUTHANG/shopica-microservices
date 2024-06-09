using Catalog.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Catalog.API.Infrastructure.Data.Config
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(p => p.Price).HasPrecision(18, 2);

            builder.Property(p => p.Id)
               .UseHiLo("productseq");

            builder.HasOne(p => p.Brand)
             .WithMany(b => b.Products)
             .HasForeignKey(p => p.BrandId);

            builder.HasOne(p => p.Category)
             .WithMany(c => c.Products)
             .HasForeignKey(p => p.CategoryId);
        }
    }
}
