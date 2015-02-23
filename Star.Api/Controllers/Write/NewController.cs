using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Star.Api.Controllers.Core;
using Star.Api.Dto.Write;
using Star.Model.Models.Write;

namespace Star.Api.Controllers.Write
{
    public class NewController : GenericController<New>
    {
        [HttpGet]
        public DtoNew GetByDate(string param, DateTime param2)
        {
            string user = param;
            var date = param2;
            var prev = Repository.FindList(a => a.Date < date).OrderByDescending(a => a.Date).FirstOrDefault();
            var next = Repository.FindList(a => a.Date > date).OrderBy(a => a.Date).FirstOrDefault();
            var prevDate = prev == null ? null : prev.Date.ToString("yyyy-MM-dd");
            var nextDate = next == null ? null : next.Date.ToString("yyyy-MM-dd");
            var news = Repository.FindList(a => a.CreatedBy == user && a.Date == date);
            
            return new DtoNew
            {
                News = news,
                Prev = prevDate,
                Next = nextDate
            };
        }

        [HttpGet]
        public List<New> Search(string param)
        {
            string textToSearch = param;
            var treaties = Repository.FindList(a => a.Title.Contains(textToSearch) || a.Content.Contains(textToSearch));
            return treaties;
        }
    }
}
