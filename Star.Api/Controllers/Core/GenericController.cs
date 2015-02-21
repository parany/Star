using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Star.Model.Models;
using Star.Model.Repositories;

namespace Star.Api.Controllers.Core
{
    public class GenericController<T> : ApiController
        where T : BaseObject
    {
        protected GenericRepository<T> Repository { get; set; }

        public GenericController()
        {
            Repository = new GenericRepository<T>();
        }

        [HttpGet]
        public virtual List<T> GetAll()
        {
            return Repository.FindAll().ToList();
        }

        [HttpGet]
        public virtual T Get(string param)
        {
            string id = param;
            return Repository.Find(t => t.Id == id);
        }

        public virtual bool Update(T model)
        {
            return Repository.Update(model);
        }

        [HttpPost]
        public virtual T Insert(T model)
        {
            Repository.Insert(model);
            return model;
        }

        [HttpGet]
        public bool Delete(string param)
        {
            string id = param;
            return Repository.Remove(m => m.Id == id);
        }
    }
}
