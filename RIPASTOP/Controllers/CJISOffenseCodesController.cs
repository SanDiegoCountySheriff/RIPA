using RIPASTOP.Models;
using System;
using System.Data;
using System.Linq;
using System.Web.Http;
//using System.Web.Http.Cors;

namespace RIPASTOP.Controllers
{
    public class CJISOffenseCodesController : ApiController
    {
        private Entities db = new Entities();

        public partial class DTOCJISOffenseCodes
        {
            public int Code { get; set; }
            public string Description { get; set; }
            public string Repealed { get; set; }
        }

        // GET: api/CJISOffenseCodes
        public IQueryable<DTOCJISOffenseCodes> GetCJISOffenseCodes(string fragment) // no section type filter
        //public IQueryable<DTOCJISOffenseCodes> GetCJISOffenseCodes(string type, string sectype, string fragment) //sectype will combine with type
        {
            if (String.IsNullOrEmpty(fragment))
            {
                return db.CJISOffenseCodes
               //.Where(x => x.Offense_Repealed > DateTime.Now.ToString("yyyy-MM-dd")) //2011-12-31
               //.Where(x => x.Offense_Type_of_Statute_CD.Contains(type) || x.Offense_Type_of_Statute_CD.Contains(sectype))
               .Select(x => new DTOCJISOffenseCodes()
               {
                   Code = x.Offense_Code,
                   Description = x.Offense_Statute + " " + x.Offense_Type_of_Statute_CD + " - " + x.Statute_Literal_25 + " (" + x.Offense_Type_of_Charge + ")",
                   Repealed = x.Offense_Repealed
               })
               .Where(x => x.Repealed.Trim().Length < 2)
               .OrderBy(x => x.Description);
            }
            else
            {
                return db.CJISOffenseCodes
                //.Where(x => x.Offense_Type_of_Statute_CD.Contains(type) || x.Offense_Type_of_Statute_CD.Contains(sectype))
                .Select(x => new DTOCJISOffenseCodes()
                {
                    Code = x.Offense_Code,
                    Description = x.Offense_Statute + " " + x.Offense_Type_of_Statute_CD + " - " + x.Statute_Literal_25 + " (" + x.Offense_Type_of_Charge + ")",
                    Repealed = x.Offense_Repealed
                })
                .Where(x => x.Repealed.Trim().Length < 2)
                .Where(x => x.Description.Contains(fragment))
                .OrderBy(x => x.Description);
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

        private bool CJISOffenseCodesExists(int id)
        {
            return db.CJISOffenseCodes.Count(e => e.Offense_Code == id) > 0;
        }
    }
}