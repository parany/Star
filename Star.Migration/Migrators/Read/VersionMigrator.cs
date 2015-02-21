using System.Collections.Generic;
using Star.Model.Models.Read;

namespace Star.Migration.Migrators.Read
{
    public class VersionMigrator : GenericMigrator<Version>
    {
        public VersionMigrator(string fileName)
            : base(fileName)
        {
        }

        protected override void Fill()
        {
            Entities = new List<Version>
                {
                    new Version {  Code = "MLG", Description = "Malagasy taloha" },
                    new Version {  Code = "NET", Description = "New English Translation" }
                };
        }
    }
}
