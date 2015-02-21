namespace Star.Model.Models.Account
{
    public class User : BaseObject
    {
        public string UserName { get; set; }

        public string FullName { get; set; }

        public string Password { get; set; }

        public Role Role { get; set; }

        public bool IsActive { get; set; }
    }
}
