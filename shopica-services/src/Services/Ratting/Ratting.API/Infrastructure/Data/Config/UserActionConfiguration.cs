using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ratting.API.Models;

namespace Ratting.API.Infrastructure.Data.Config
{
    public class UserActionConfiguration : IEntityTypeConfiguration<UserAction>
    {
        public void Configure(EntityTypeBuilder<UserAction> builder)
        {
            builder.HasKey(ua => new { ua.UserId, ua.CommentId });
        }
    }
}
