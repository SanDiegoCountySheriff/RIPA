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
    public class SchoolsController : ApiController
    {
        private Entities db = new Entities();

        public partial class DTOschools
        {
                public string Code { get; set; }
                public string Description { get; set; }
        }

        // GET: api/Schools
        public IQueryable<DTOschools> Getschools(string type, string fragment)
        {
           
            if (String.IsNullOrEmpty(fragment))
            {
                return db.schools
               .Where(x => x.Status == "Active")
               .Where(x => x.County.Contains(type) || x.CDS_Code == "ZZZZZZZZZZZZZZ")
               .Select(x => new DTOschools()
               {
                   Code = x.CDS_Code,
                   Description = x.schoolname + " (" + x.District + ")"
               })
               .OrderBy(x => x.Description);
            }
            else
            {
                return db.schools
                .Where(x => x.Status == "Active")
                .Where(x => x.County.Contains(type) || x.CDS_Code == "ZZZZZZZZZZZZZZ")
                .Select(x => new DTOschools()
                {
                    Code = x.CDS_Code,
                    Description = x.schoolname + " (" + x.District + ")"
                })
                .Where(x => x.Description.Contains(fragment))
                .OrderBy(x => x.Description);
            }
        }

        // GET: api/Schools/5
        [ResponseType(typeof(schools))]
        public async Task<IHttpActionResult> Getschools(string id)
        {
            schools schools = await db.schools.FindAsync(id);
            if (schools == null)
            {
                return NotFound();
            }

            return Ok(schools);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool schoolsExists(string id)
        {
            return db.schools.Count(e => e.CDS_Code == id) > 0;
        }
    }
}