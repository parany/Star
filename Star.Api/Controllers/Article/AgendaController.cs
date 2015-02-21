using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Star.Api.Controllers.Core;
using Star.Api.Dto.Agenda;
using Star.Model.Models.Article;

namespace Star.Api.Controllers.Article
{
    public class AgendaController : GenericController<Agenda>
    {
        [HttpGet]
        public DtoAgenda GetByDate(string param, DateTime param2)
        {
            string user = param;
            var date = param2;
            var prev = Repository.FindList(a => a.Date < date).OrderByDescending(a => a.Date).FirstOrDefault();
            var next = Repository.FindList(a => a.Date > date).OrderBy(a => a.Date).FirstOrDefault();
            var prevDate = prev == null ? null : prev.Date.ToString("yyyy-MM-dd");
            var nextDate = next == null ? null : next.Date.ToString("yyyy-MM-dd");

            var agendas = Repository.FindList(a => a.CreatedBy == user && a.Date == date);
            return new DtoAgenda
            {
                Agendas   = agendas,
                Prev = prevDate,
                Next = nextDate
            };
        }

        [HttpGet]
        public List<Agenda> Search(string param)
        {
            string textToSearch = param;
            var agendas = Repository.FindList(a => a.Title.Contains(textToSearch) || a.Text.Contains(textToSearch));
            return agendas;
        } 
    }
}
