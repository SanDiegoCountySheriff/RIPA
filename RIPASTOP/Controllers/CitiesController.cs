using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using RIPASTOP.Models;

namespace RIPASTOP.Controllers
{
    public class CitiesController : ApiController
    {
        private Entities db = new Entities();

        public partial class DTOCities
        {
            public string Code { get; set; }
            public string Description { get; set; }
        }

        // GET: api/Cities
        public IQueryable<DTOCities> GetCities(string fragment)
        {

            if (String.IsNullOrEmpty(fragment))
            {
                return db.Cities
                    .Select(x => new DTOCities()
                    {
                        Code = x.City,
                        Description = x.City
                    }
                );
            }
            else
            {
                return db.Cities
                    .Where(x => x.City.Contains(fragment))
                    .Select(x => new DTOCities()
                    {
                        Code = x.City,
                        Description = x.City
                    }
                );
            }
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CitiesExists(string id)
        {
            return db.Cities.Count(e => e.City == id) > 0;
        }
    }
}