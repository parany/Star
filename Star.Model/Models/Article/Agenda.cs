using System;
using MongoDB.Bson.Serialization.Attributes;

namespace Star.Model.Models.Article
{
    public class Agenda : BaseObject
    {
        [BsonDateTimeOptions(Kind = DateTimeKind.Local, DateOnly = true)]
        public DateTime Date { get; set; }

        public string Title { get; set; }

        public string Text { get; set; }
    }
}
