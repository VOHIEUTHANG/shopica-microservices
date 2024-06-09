using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ratting.API.Models;

namespace Ratting.API.Infrastructure.Data.Config
{
    public class BlogConfiguration : IEntityTypeConfiguration<Blog>
    {
        public void Configure(EntityTypeBuilder<Blog> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .UseHiLo("blogseq");
        }
    }
}
