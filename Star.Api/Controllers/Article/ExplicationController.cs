using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Star.Api.Controllers.Core;
using Star.Api.Dto.Artricle;
using Star.Api.Dto.Write;
using Star.Model.Models.Article;
using Star.Model.Models.Core;
using Star.Model.Repositories;

namespace Star.Api.Controllers.Article
{
    public class ExplicationController : GenericController<Explication>
    {
        [HttpGet]
        public DtoExplication GetByDate(string param, DateTime param2)
        {
            string user = param;
            var date = param2;
            var prev = Repository.FindList(a => a.Date < date).OrderByDescending(a => a.Date).FirstOrDefault();
            var next = Repository.FindList(a => a.Date > date).OrderBy(a => a.Date).FirstOrDefault();
            var prevDate = prev == null ? null : prev.Date.ToString("yyyy-MM-dd");
            var nextDate = next == null ? null : next.Date.ToString("yyyy-MM-dd");
            var tags = new GenericRepository<Tag>().FindList(t => t.Type == "Explication");

            var explications = Repository.FindList(a => a.CreatedBy == user && a.Date == date);
            foreach (var explication in explications)
            {
                for (int i = 0; i < explication.TagIdList.Count; i++)
                {
                    explication.TagIdList[i] = tags.First(t => t.Id == explication.TagIdList[i]).Description;
                }
            }
            return new DtoExplication
            {
                Explications = explications,
                Prev = prevDate,
                Next = nextDate
            };
        }

        [HttpGet]
        public List<Explication> Search(string param)
        {
            string textToSearch = param;
            var explications = Repository.FindList(a => a.Title.Contains(textToSearch) || a.Content.Contains(textToSearch));
            var tags = new GenericRepository<Tag>().FindList(t => t.Type == "Explication");
            foreach (var explication in explications)
            {
                for (int i = 0; i < explication.TagIdList.Count; i++)
                {
                    explication.TagIdList[i] = tags.First(t => t.Id == explication.TagIdList[i]).Description;
                }
            }
            return explications;
        }
    }
}
