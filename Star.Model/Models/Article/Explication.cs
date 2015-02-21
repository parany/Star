using System;
using System.Collections.Generic;
using MongoDB.Bson.Serialization.Attributes;
using Star.Model.Models.Read;

namespace Star.Model.Models.Article
{
    public class Explication : BaseObject
    {
        public string Title { get; set; }

        public string Content { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime Date { get; set; }

        public List<string> TagIdList { get; set; }

        public List<VerseRead> VerseReadList { get; set; } 
    }
}
