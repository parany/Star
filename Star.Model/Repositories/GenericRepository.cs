using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Linq.Expressions;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using Star.Model.Models;
using MongoDB.Driver.Linq;

namespace Star.Model.Repositories
{
    public class GenericRepository<T> where T : BaseObject
    {
        private readonly string databaseName = ConfigurationManager.AppSettings["DatabaseName"];

        private MongoCollection<T> Collection { get; set; }

        public GenericRepository()
        {
            const string connectionString = "mongodb://localhost";
            var client = new MongoClient(connectionString);
            var server = client.GetServer();
            var database = server.GetDatabase(databaseName);
            Collection = database.GetCollection<T>(typeof(T).Name);
        }

        public long GetCount()
        {
            return Collection.Count();
        }

        public long GetCount(Expression<Func<T, bool>> predicate)
        {
            IMongoQuery query = Query<T>.Where(predicate);
            return Collection.Count(query);
        }

        public long GetMax(Expression<Func<T, bool>> predicate, Expression<Func<T, int>> selector)
        {
            return Collection.AsQueryable()
                .Where(predicate)
                .Select(selector)
                .Max();
        }

        public T Find(Expression<Func<T, bool>> predicate)
        {
            IMongoQuery query = Query<T>.Where(predicate);
            return Collection.Find(query).FirstOrDefault();
        }

        public List<T> FindList(Expression<Func<T, bool>> predicate)
        {
            IMongoQuery query = Query<T>.Where(predicate);
            return Collection.Find(query).ToList();
        }

        public List<T> FindAll()
        {
            return Collection.FindAll().ToList();
        }

        public bool Insert(T model)
        {
            if (string.IsNullOrEmpty(model.CreatedBy))
                model.CreatedBy = "System";

            model.CreatedOn = DateTime.Now;
            Collection.Insert(model);
            return true;
        }

        public bool Insert(List<T> modelList)
        {
            foreach (var model in modelList)
            {
                model.CreatedOn = DateTime.Now;
                if (string.IsNullOrEmpty(model.CreatedBy))
                    model.CreatedBy = "System";
            }
            Collection.InsertBatch(modelList);
            return true;
        }

        public bool Update(T model)
        {
            if (string.IsNullOrEmpty(model.UpdatedBy))
                model.UpdatedBy = "System";

            model.UpdatedOn = DateTime.Now;
            Collection.Save(model);
            return true;
        }

        public bool Update(List<T> modelList)
        {
            foreach (var model in modelList)
            {
                if (string.IsNullOrEmpty(model.UpdatedBy))
                    model.UpdatedBy = "System";

                model.UpdatedOn = DateTime.Now;
                Collection.Save(model);
            }
            return true;
        }

        public bool Remove(Expression<Func<T, bool>> predicate)
        {
            IMongoQuery query = Query<T>.Where(predicate);
            Collection.Remove(query);
            return true;
        }
    }
}