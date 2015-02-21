using System.Collections.Generic;
using Star.Model.Models.Article;

namespace Star.Api.Dto.Artricle
{
    public class DtoExplication
    {
        public List<Explication> Explications { get; set; }

        public string Prev { get; set; }

        public string Next { get; set; }
    }
}