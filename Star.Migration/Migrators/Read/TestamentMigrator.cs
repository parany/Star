using System.Collections.Generic;
using Star.Model.Models.Read;

namespace Star.Migration.Migrators.Read
{
    public class TestamentMigrator : GenericMigrator<Testament>
    {
        public TestamentMigrator(string fileName)
            : base(fileName)
        {
        }

        protected override void Fill()
        {
            Entities = new List<Testament>
                {
                    new Testament {  Description = "AT" },
                    new Testament {  Description = "NT" }
                };
        }
    }
}
