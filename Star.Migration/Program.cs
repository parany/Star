using System;
using Star.Migration.Migrators;
using Star.Migration.Migrators.Account;
using Star.Migration.Migrators.Core;
using Star.Migration.Migrators.Write;

namespace Star.Migration
{
    class Program
    {
        static void Main()
        {
            //var testamentMigrator = new TestamentMigrator("testament.xml");
            //testamentMigrator.Execute();

            //var bookMigrator = new BookMigrator("book.xml");
            //bookMigrator.Execute();

            //var verseMigrator = new VerseMigrator("verse.xml");
            //verseMigrator.Execute();

            //var versionMigrator = new VersionMigrator("verse.xml");
            //versionMigrator.Execute();

            //var userMigrator = new UserMigrator("verse.xml");
            //userMigrator.Execute();

            //var tagMigrator = new TagMigrator("testament.xml");
            //tagMigrator.Execute();

            //var cultureMigrator = new CultureMigrator("testament.xml");
            //cultureMigrator.Execute();

            var sourceMigrator = new SourceMigrator("testament.xml");
            sourceMigrator.Execute();

            Console.WriteLine("Done");
            Console.ReadKey();
        }
    }
}
