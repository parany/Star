using System;
using System.Linq;
using System.Xml.Linq;
using Star.Model.Models.Read;
using Star.Model.Repositories;

namespace Star.Migration.Migrators.Read
{
    public class BookMigrator : GenericMigrator<Book>
    {
        public BookMigrator(string fileName)
            : base(fileName)
        {
        }

        protected override void Fill()
        {
            var testamentRepository = new GenericRepository<Testament>();
            var testaments = testamentRepository.FindAll().ToList();
            foreach (XElement child in Children)
            {
                var description = child.Elements("column").ElementAt(1).Value;
                string an = child.Elements("column").ElementAt(2).Value.Trim();
                int displayOrder = Int32.Parse(child.Elements("column").ElementAt(3).Value);
                Entities.Add(
                    new Book
                    {
                        Description = description,
                        DisplayOrder = displayOrder,
                        Version = "MLG",
                        TestamentId = testaments.First(t => t.Description == an).Id
                    });
            }
        }
    }
}
