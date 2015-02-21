using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Star.Model.Models
{
    public class BaseObject
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string CreatedBy { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime CreatedOn { get; set; }

        public string UpdatedBy { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime UpdatedOn { get; set; }
    }
}