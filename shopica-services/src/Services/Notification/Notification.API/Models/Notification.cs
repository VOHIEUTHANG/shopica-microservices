using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Notification.API.Models.Enums;

namespace Notification.API.Models
{
    public class Notification : BaseEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Content { get; set; }
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public NotificationSourceEvent SourceEvent { get; set; }
        public string SourceDocumentId { get; set; }
        public string Attribute1 { get; set; }
        public string Attribute2 { get; set; }
        public string Attribute3 { get; set; }
        public bool IsRead { get; set; }
    }
}
