using System.Collections.Generic;
using Star.Model.Models.Account;

namespace Star.Migration.Migrators.Account
{
    public class UserMigrator : GenericMigrator<User>
    {
        public UserMigrator(string fileName)
            : base(fileName)
        {
        }

        protected override void Fill()
        {
            Entities = new List<User>
                {
                    new User
                    {
                        UserName = "parany", 
                        FullName = "ANDRIANANDRAINA Andriamparany", 
                        Password = "pass",
                        Role = Role.Pub,
                        IsActive = true
                    },
                    new User
                    {
                        UserName = "admin", 
                        FullName = "MANJAKA admin", 
                        Password = "pass",
                        Role = Role.Admin, 
                        IsActive = true
                    }
                };
        }
    }
}
