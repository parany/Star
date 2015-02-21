using System.Collections.Generic;
using System.Xml.Linq;
using Star.Model.Models;
using Star.Model.Repositories;

namespace Star.Migration.Migrators
{
    public abstract class GenericMigrator<T> where T : BaseObject
    {
        #region Properties

        protected List<T> Entities { get; set; }

        protected IEnumerable<XElement> Children { get; set; }
        
        private GenericRepository<T> Repository { get; set; } 

        private XElement PmaXmlExport { get; set; }

        private XElement Database { get; set; }

        #endregion Properties

        protected GenericMigrator(string fileName)
        {
            const string path = @"D:\any\projects\any\angularjs-mvc4\star\sources\Star\Star.Migration\XML\";
            var fromFile = XDocument.Load(path + fileName);
            PmaXmlExport = fromFile.Element("pma_xml_export");
            if (PmaXmlExport == null)
                return;

            Database = PmaXmlExport.Element("database");
            if (Database != null) 
                Children = Database.Elements("table");

            Entities = new List<T>();
            Repository = new GenericRepository<T>();
        }

        public void Execute()
        {
            Fill();
            Repository.Insert(Entities);
        }

        protected abstract void Fill();
    }
}
