using System.Collections.Generic;

namespace Star.Api.Dto.Agenda
{
    public class DtoAgenda
    {
        public List<Model.Models.Article.Agenda> Agendas { get; set; }

        public string Prev { get; set; }

        public string Next { get; set; }
    }
}