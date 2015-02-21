using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Star.Model.Models.Write
{
    public class Dico : BaseObject
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string FromId { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string ToId { get; set; }

        public string Text { get; set; }

        public string Meaning { get; set; }

        public List<string> Illustrations { get; set; } 
    }
}
