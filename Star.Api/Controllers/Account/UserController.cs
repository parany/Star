using Star.Api.Controllers.Core;
using Star.Model.Models.Account;

namespace Star.Api.Controllers.Account
{
    public class UserController : GenericController<User>
    {
        public User Login(User user)
        {
            return Repository.Find(u => u.IsActive && u.UserName == user.UserName && u.Password == user.Password);
        }
    }
}
