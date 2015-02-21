using System.Collections.Generic;
using Star.Model.Models.Core;

namespace Star.Migration.Migrators.Core
{
    public class CultureMigrator : GenericMigrator<Culture>
    {
        public CultureMigrator(string fileName)
            : base(fileName)
        {
        }

        protected override void Fill()
        {
            Entities = new List<Culture>
                {
                    new Culture {  Code = "MLG", Description = "Malagasy" },
                    new Culture {  Code = "EN", Description = "English" },
                    new Culture {  Code = "FR", Description = "French" }
                };
        }
    }
}
