using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Payment.API.Models;

namespace Payment.API.Infrastructure.Data.Config
{
    public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.HasKey(x => x.Id);


            builder.Property(p => p.Id)
               .UseHiLo("transactionseq");

            builder.HasOne(p => p.Payment)
               .WithMany(pm => pm.Transactions)
               .HasForeignKey(p => p.PaymentId);
        }
    }
}
