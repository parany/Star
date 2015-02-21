using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using Star.Model.Models.Read;
using Star.Model.Repositories;

namespace Star.Migration.Migrators.Read
{
    public class VerseMigrator : GenericMigrator<Verse>
    {
        private readonly object _lock = new object();

        public VerseMigrator(string fileName)
            : base(fileName)
        {
        }

        protected override void Fill()
        {
            var bookRepository = new GenericRepository<Book>();
            var books = bookRepository.FindAll().ToList();
            Parallel.ForEach(Children, child => FillTask(child, books));
        }

        private void FillTask(XElement child, IEnumerable<Book> books)
        {
            var strBook = child.Elements("column").ElementAt(1).Value.Trim();
            Book book = books.First(x => x.Description == strBook);
            int chapter = Int32.Parse(child.Elements("column").ElementAt(2).Value.Trim());
            int paragraph = Int32.Parse(child.Elements("column").ElementAt(3).Value);
            string content = child.Elements("column").ElementAt(4).Value;
            string version = child.Elements("column").ElementAt(5).Value;
            lock (_lock)
            {
                Entities.Add(new Verse
                {
                    BookId = book.Id,
                    Chapter = chapter,
                    Content = content,
                    Paragraph = paragraph,
                    Version = version
                });
            }
            
        }
    }
}
