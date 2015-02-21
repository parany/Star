using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Star.Model.Models.Read
{
    public class Book : BaseObject
    {
        public string Description { get; set; }

        public int DisplayOrder { get; set; }

        public string Version { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string TestamentId { get; set; } 
    }
}
