using System.Collections.Generic;
using System.Web.Http;
using Star.Api.Controllers.Core;
using Star.Api.Dto.Dico;
using Star.Model.Models.Write;

namespace Star.Api.Controllers.Write
{
    public class DicoController : GenericController<Dico>
    {
        [HttpPost]
        public List<Dico> Search(DtoSearchRequest request)
        {
            var dicos = Repository.FindList(d =>
                (string.IsNullOrEmpty(request.Text) || d.Text.Contains(request.Text)));
            return dicos;
        } 
    }
}
