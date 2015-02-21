using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Star.Model.Models.Read
{
    public class Verse : BaseObject
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string BookId { get; set; }

        public int Chapter { get; set; }

        public int Paragraph { get; set; }

        public string Content { get; set; }

        public string Version { get; set; }
    }
}
