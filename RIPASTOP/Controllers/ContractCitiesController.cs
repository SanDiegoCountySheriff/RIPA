using RIPASTOP.Models;
using System;
using System.Data;
using System.Linq;
using System.Web.Http;

namespace RIPASTOP.Controllers
{
    public class ContractCitiesController : ApiController
    {
        private Entities db = new Entities();

        public partial class DTOContractCities
        {
            public string Code { get; set; }
            public string Description { get; set; }
        }

        // GET: api/Beats
        public IQueryable<DTOContractCities> GetContractCities(string fragment)
        {

            if (String.IsNullOrEmpty(fragment))
            {
                return db.ContractCities
                    .Select(x => new DTOContractCities()
                    {
                        Code = x.ContractCity,
                        Description = x.ContractCity
                    }
                );
            }
            else
            {
                return db.ContractCities
                    .Where(x => x.ContractCity.Contains(fragment))
                    .Select(x => new DTOContractCities()
                    {
                        Code = x.ContractCity,
                        Description = x.ContractCity
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

        private bool ContractCitiesExists(string id)
        {
            return db.ContractCities.Count(e => e.ContractCity == id) > 0;
        }
    }
}