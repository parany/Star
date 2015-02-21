using System.Collections.Generic;
using System.Linq;
using Star.Api.Controllers.Core;
using Star.Model.Models.Read;

namespace Star.Api.Controllers.Read
{
    public class BookController : GenericController<Book>
    {
        public List<Book> GetByTestament(string param)
        {
            string testamentId = param;
            return Repository
                .FindList(b => b.TestamentId == testamentId)
                .OrderBy(b => b.DisplayOrder)
                .ToList();
        }
    }
}
