using Identity.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.API.Infrastructure.Data.Config
{
    public class AddressConfiguration : IEntityTypeConfiguration<Address>
    {
        public void Configure(EntityTypeBuilder<Address> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(p => p.Id)
               .UseHiLo("addressseq");

            builder.HasOne(u => u.User)
               .WithMany(r => r.Addresses)
               .HasForeignKey(u => u.UserId);
        }
    }
}
