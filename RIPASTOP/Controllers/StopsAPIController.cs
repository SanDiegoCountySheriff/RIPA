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
using Newtonsoft.Json.Linq;

namespace RIPASTOP.Controllers
{
    public class StopsAPIController : ApiController
    {
        private RIPASTOPContext db = new RIPASTOPContext();

        // GET: api/StopsAPI
        [ResponseType(typeof(Stop))]
        public async Task<IHttpActionResult> GetStop()
        {
            UserProfile_Conf uid = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());
           
            List<Stop> Stops = await db.Stop.Where(x => x.UserProfileID == uid.UserProfileID).OrderByDescending(x => x.Time).Take(10).ToListAsync();
            return Ok(Stops);
        }        

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StopExists(int id)
        {
            return db.Stop.Count(e => e.ID == id) > 0;
        }
    }
}