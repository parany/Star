using System.Collections.Generic;
using Star.Model.Models.Core;

namespace Star.Migration.Migrators.Core
{
    public class TagMigrator : GenericMigrator<Tag>
    {
        public TagMigrator(string fileName)
            : base(fileName)
        {
        }

        protected override void Fill()
        {
            Entities = new List<Tag>
                {
                    new Tag {  Description = "Foi", IsActive = true, Type = "Note"},
                    new Tag {  Description = "Fraternité", IsActive = true, Type = "Note" },
                    new Tag {  Description = "Amitié", IsActive = true, Type = "Note" },
                    new Tag {  Description = "Amour", IsActive = true, Type = "Note" },
                    new Tag {  Description = "Miséricorde", IsActive = true, Type = "Note" },
                    new Tag {  Description = "Theology", IsActive = true, Type = "Treaty" },
                    new Tag {  Description = "Informatic", IsActive = true, Type = "Treaty" },
                    new Tag {  Description = "Politic", IsActive = true, Type = "Treaty" },
                    new Tag {  Description = "Football", IsActive = true, Type = "Treaty" },
                    new Tag {  Description = "Mathematic", IsActive = true, Type = "Treaty" },
                    new Tag {  Description = "Psychology", IsActive = true, Type = "Treaty" },
                    new Tag {  Description = "Faith", IsActive = true, Type = "Explication" },
                    new Tag {  Description = "Mercifulness", IsActive = true, Type = "Explication" },
                    new Tag {  Description = "Love", IsActive = true, Type = "Explication" }
                };
        }
    }
}
