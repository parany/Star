using System.Collections.Generic;
using System.Web.Http;
using Star.Model.Models.Core;

namespace Star.Api.Controllers.Core
{
    public class TagController : GenericController<Tag>
    {
        [HttpGet]
        public List<Tag> GetByType(string param)
        {
            string type = param;
            return Repository.FindList(t => t.Type == type);
        } 
    }
}
