using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Star.Api.Controllers.Core;
using Star.Api.Dto.Write;
using Star.Model.Models.Core;
using Star.Model.Models.Write;
using Star.Model.Repositories;

namespace Star.Api.Controllers.Write
{
    public class TreatyController : GenericController<Treaty>
    {
        [HttpGet]
        public DtoTreaty GetByDate(string param, DateTime param2)
        {
            string user = param;
            var date = param2;
            var prev = Repository.FindList(a => a.Date < date).OrderByDescending(a => a.Date).FirstOrDefault();
            var next = Repository.FindList(a => a.Date > date).OrderBy(a => a.Date).FirstOrDefault();
            var prevDate = prev == null ? null : prev.Date.ToString("yyyy-MM-dd");
            var nextDate = next == null ? null : next.Date.ToString("yyyy-MM-dd");
            var tags = new GenericRepository<Tag>().FindList(t => t.Type == "Treaty");

            var treaties = Repository.FindList(a => a.CreatedBy == user && a.Date == date);
            foreach (var treaty in treaties)
            {
                for (int i = 0;i < treaty.TagIdList.Count;i++)
                {
                    treaty.TagIdList[i] = tags.First(t => t.Id == treaty.TagIdList[i]).Description;
                }
            }
            return new DtoTreaty
            {
                Treaties = treaties,
                Prev = prevDate,
                Next = nextDate
            };
        }

        [HttpGet]
        public List<Treaty> Search(string param)
        {
            string textToSearch = param;
            var treaties = Repository.FindList(a => a.Title.Contains(textToSearch) || a.Text.Contains(textToSearch));
            var tags = new GenericRepository<Tag>().FindList(t => t.Type == "Treaty");
            foreach (var treaty in treaties)
            {
                for (int i = 0; i < treaty.TagIdList.Count; i++)
                {
                    treaty.TagIdList[i] = tags.First(t => t.Id == treaty.TagIdList[i]).Description;
                }
            }
            return treaties;
        }
    }
}
