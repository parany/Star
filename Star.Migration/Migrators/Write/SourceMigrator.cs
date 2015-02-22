using System.Collections.Generic;
using Star.Model.Models.Write;

namespace Star.Migration.Migrators.Write
{
    public class SourceMigrator : GenericMigrator<Source>
    {
        public SourceMigrator(string fileName)
            : base(fileName)
        {
        }

        protected override void Fill()
        {
            Entities = new List<Source>
                {
                    new Source { Description = "Developpez.com" },
                    new Source { Description = "Javascript Weekly" },
                    new Source { Description = "AngularJs Weekly" },
                    new Source { Description = ".Net Weekly" },
                    new Source { Description = "ReadWrite" },
                };
        }
    }
}
