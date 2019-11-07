using RIPASTOP.Models;
using System;
using System.Data;
using System.Linq;
using System.Web.Http;

namespace RIPASTOP.Controllers
{
    public class BeatsController : ApiController
    {
        private Entities db = new Entities();

        public partial class DTOBeats
        {
            public string Code { get; set; }
            public string Description { get; set; }
        }

        // GET: api/Beats
        public IQueryable<DTOBeats> GetBeats(string fragment)
        {

            if (String.IsNullOrEmpty(fragment))
            {
                return db.Beats
                    .Select(x => new DTOBeats()
                    {
                        Code = x.Beat,
                        Description = x.Community
                    }
                );
            }
            else
            {
                return db.Beats
                    .Where(x => x.Beat.Contains(fragment))
                    .Select(x => new DTOBeats()
                    {
                        Code = x.Beat,
                        Description = x.Community
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

        private bool BeatsExists(string id)
        {
            return db.Beats.Count(e => e.Beat == id) > 0;
        }
    }
}