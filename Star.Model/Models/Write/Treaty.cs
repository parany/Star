using System;
using System.Collections.Generic;
using MongoDB.Bson.Serialization.Attributes;

namespace Star.Model.Models.Write
{
    public class Treaty : BaseObject
    {
        [BsonDateTimeOptions(Kind = DateTimeKind.Local, DateOnly = true)]
        public DateTime Date { get; set; }

        public string Title { get; set; }

        public string Text { get; set; }

        public List<string> TagIdList { get; set; } 
    }
}
