using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Star.Api.Controllers.Core;
using Star.Api.Dto.Read;
using Star.Model.Models.Read;
using Star.Model.Repositories;

namespace Star.Api.Controllers.Read
{
    public class VerseController : GenericController<Verse>
    {
        public IEnumerable<int> GetChapters(string param)
        {
            string bookId = param;
            var maxChapter = (int)Repository.GetMax(b => b.BookId == bookId, b => b.Chapter);
            return Enumerable.Range(1, maxChapter);
        }

        public IEnumerable<int> GetParagrahs(string param, string param2)
        {
            string bookId = param;
            int chapter = int.Parse(param2);
            var maxParagraph = (int)Repository.GetMax(b => b.BookId == bookId && b.Chapter == chapter, b => b.Paragraph);
            return Enumerable.Range(1, maxParagraph);
        }

        [HttpPost]
        public List<Verse> GetList(DtoVerse dtoVerse)
        {
            return
                Repository
                .FindList(v => v.BookId == dtoVerse.BookId && v.Chapter == dtoVerse.Chapter &&
                        v.Paragraph >= dtoVerse.ParagraphMin
                        && v.Paragraph <= dtoVerse.ParagraphMax && v.Version == dtoVerse.Version)
                .OrderBy(v => v.Paragraph)
                .ToList();
        }

        [HttpGet]
        public List<Verse> GetList(string param, string param2)
        {
            string version = param;
            string textToSearch = param2;
            var verses = Repository.FindList(v => v.Content.Contains(textToSearch) && v.Version == version);
            var books = new GenericRepository<Book>().FindAll().ToList();
            foreach (var verse in verses)
            {
                verse.BookId = string.Format("{0} {1},{2}", books.Find(b => b.Id == verse.BookId).Description, verse.Chapter, verse.Paragraph);
            }
            return verses;
        }
    }
}
