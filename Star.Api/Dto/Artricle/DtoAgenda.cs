using System.Collections.Generic;

namespace Star.Api.Dto.Artricle
{
    public class DtoAgenda
    {
        public List<Model.Models.Article.Agenda> Agendas { get; set; }

        public string Prev { get; set; }

        public string Next { get; set; }
    }
}