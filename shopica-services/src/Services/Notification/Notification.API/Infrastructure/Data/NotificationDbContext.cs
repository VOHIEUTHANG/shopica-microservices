using Microsoft.EntityFrameworkCore;
using MongoDB.EntityFrameworkCore.Extensions;
using Notification.API.Models;

namespace Notification.API.Infrastructure.Data
{
    public class NotificationDbContext : DbContext
    {
        public NotificationDbContext(DbContextOptions<NotificationDbContext> options) : base(options)
        {
        }
        //public DbSet<User> Users { get; set; }
        //public DbSet<Participant> Participants { get; set; }
        public DbSet<Models.Notification> Notifications { get; set; }
        public DbSet<Message> Messages { get; set; }
        //public DbSet<Conversation> Conversations { get; set; }
        //public DbSet<Attachment> Attachments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //modelBuilder.Entity<User>().ToCollection("users");
            //modelBuilder.Entity<Participant>().ToCollection("participants");
            modelBuilder.Entity<Models.Notification>().ToCollection("notifications");
            //modelBuilder.Entity<Message>().ToCollection("messages");
            //modelBuilder.Entity<Conversation>().ToCollection("conversations");
            //modelBuilder.Entity<Attachment>().ToCollection("attachments");
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }
    }
}
