using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Star.Model.Models.Read
{
    public class Note : BaseObject
    {
        public string Description { get; set; }

        public string Content { get; set; }

        public List<string> TagIdList { get; set; }
            
        [BsonRepresentation(BsonType.ObjectId)]
        public string VerseId { get; set; }
    }
}
