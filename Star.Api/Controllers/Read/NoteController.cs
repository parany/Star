using System.Linq;
using System.Web.Http;
using Star.Api.Controllers.Core;
using Star.Api.Dto.Read;
using Star.Model.Models.Core;
using Star.Model.Models.Read;
using Star.Model.Repositories;
using System.Collections.Generic;
namespace Star.Api.Controllers.Read
{
    public class NoteController : GenericController<Note>
    {
        [HttpGet]
        public DtoNotes GetNotesByVerseId(string param, string param2)
        {
            string verseId = param;
            string userName = param2;
            var tags = new GenericRepository<Tag>().FindList(t => t.Type == "Note");
         
            var myNote = Repository.Find(n => n.VerseId == verseId && n.CreatedBy == userName);
            if (myNote != null)
            {
                for (var j = 0; j < myNote.TagIdList.Count; j++)
                {
                    myNote.TagIdList[j] = tags.First(t => t.Id == myNote.TagIdList[j]).Description;
                }
            }
            
            var otherNotes = Repository.FindList(n => n.VerseId == verseId && n.CreatedBy != userName);
            foreach (Note note in otherNotes)
            {
                for (var j = 0; j < note.TagIdList.Count; j++)
                {
                    note.TagIdList[j] = tags.First(t => t.Id == note.TagIdList[j]).Description;
                }
            }
            return new DtoNotes
            {
                MyNote = myNote,
                OtherNotes = otherNotes
            };
        }

        [HttpGet]
        public DtoNote GetNoteByVerseId(string param, string param2)
        {
            string verseId = param;
            string userName = param2;
            var tags = new GenericRepository<Tag>().FindList(t => t.Type == "Note");
            var myNote = Repository.Find(n => n.VerseId == verseId && n.CreatedBy == userName);
            foreach (Tag tag in tags)
            {
                tag.IsActive = myNote.TagIdList.Contains(tag.Id);
            }
            return new DtoNote
            {
                Note = myNote,
                Tags = tags
            };
        }

        [HttpPost]
        public List<DtoNoteListResponse> SearchNotes(DtoNoteListRequest request)
        {
            var notes = Repository.FindList(n => n.CreatedBy == request.UserName);
            var verseIds = notes.Select(n => n.VerseId);
            var verses = new GenericRepository<Verse>().FindList(v => verseIds.Contains(v.Id));
            var books = new GenericRepository<Book>().FindAll();
            notes = (
                from n in notes
                join v in verses on n.VerseId equals v.Id
                orderby  books.First(b => b.Id == v.BookId).DisplayOrder, v.Chapter, v.Paragraph
                select n
                ).ToList();
            return (
                from note in notes
                let verse = verses.First(v => v.Id == note.VerseId)
                let str = string.Format(
                    "{0} {1},{2}", 
                    books.First(b => b.Id == verse.BookId).Description, verse.Chapter, verse.Paragraph)
                select new DtoNoteListResponse
                {
                    NoteId = verse.Id, 
                    Description = note.Description, 
                    Verse = str
                }).ToList();
        }
    }
}
