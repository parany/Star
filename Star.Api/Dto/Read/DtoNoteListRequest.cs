using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Star.Api.Dto.Read
{
    public class DtoNoteListRequest
    {
        public string UserName { get; set; }

        public string TextToSearch { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> TagIds { get; set; }
    }
}