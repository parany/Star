using System;
using System.Collections.Generic;
using MongoDB.Bson.Serialization.Attributes;

namespace Star.Model.Models.Write
{
    public class New : BaseObject
    {
        public string Title { get; set; }

        public string Content { get; set; }

        public List<string> Citations { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime Date { get; set; }

        public Source Source { get; set; }
    }
}
