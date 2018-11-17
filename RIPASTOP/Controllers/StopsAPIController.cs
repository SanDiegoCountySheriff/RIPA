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
using System.Configuration;
using System.Text.RegularExpressions;
using System.DirectoryServices.AccountManagement;
using Newtonsoft.Json;


namespace RIPASTOP.Controllers
{
    public class StopsAPIController : ApiController
    {
        private RIPASTOPContext db = new RIPASTOPContext();
        private Entities dbe = new Entities();


        // GET: api/StopsAPI
        [ResponseType(typeof(Stop))]
        public async Task<IHttpActionResult> GetStop()
        {
            UserProfile_Conf uid = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());

            List<Stop> Stops = await db.Stop.Where(x => x.UserProfileID == uid.UserProfileID).OrderByDescending(x => x.Time).Take(10).ToListAsync();
            return Ok(Stops);
        }

        // GET: api/StopsAPI
        [ResponseType(typeof(Stop))]
        public async Task<IHttpActionResult> GetStop(int id)
        {
            UserProfile_Conf uid = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());

            string stopJson = await db.Stop.Where(x => x.ID == id).Select(x => x.JsonStop).FirstOrDefaultAsync();
            return Ok(stopJson);
        }

        // PUT: api/StopsAPI
        [HttpPut]
        //[ValidateAntiForgeryToken]
        public IHttpActionResult PutStop(JObject jsonStop, int stopId, string changeAuditReason, int submissionEdit)
        {
            HomeController.UserAuth user = new HomeController.UserAuth();
            if (ConfigurationManager.AppSettings["requireGroupMembership"] == "true")
            {
                user = HomeController.AuthorizeUser(User.Identity.Name.ToString());

                if (!user.authorizedAdmin)
                {
                    throw new HttpResponseException(HttpStatusCode.Forbidden);
                }
            }

            ExtractJNode eJson;
            eJson = new ExtractJNode("JsonStop", jsonStop);
            string jsonStopStr = eJson.traverseNode();
            Stop stop = db.Stop.Find(stopId);
            string originalJson = stop.JsonStop;
            stop.JsonStop = Regex.Replace(jsonStopStr, @"\p{Cs}", ""); // remove emojis

            CommonRoutines cr = new CommonRoutines();

            try
                {
 
                    StopChangeAudits newAuditRec = new StopChangeAudits();
                    newAuditRec.StopID = stopId;
                    newAuditRec.OrigJsonStop = originalJson;
                    newAuditRec.Time = DateTime.Now;
                    newAuditRec.NTUserName = User.Identity.Name.ToString();
                    newAuditRec.ModJsonStop = jsonStopStr;
                    newAuditRec.Reason = changeAuditReason;
                    if (ModelState.IsValid)
                    {
                        dbe.StopChangeAudits.Add(newAuditRec);
                        dbe.SaveChanges();
                    }

                    if (stop.SubmissionsID != null)
                    {
                        JObject submissionO = JObject.Parse(stop.JsonSubmissions);
                        JObject lastSubmission = (JObject)submissionO["SubmissionInfo"].Last();
                        lastSubmission["edited"] = true;
                        stop.JsonSubmissions = JsonConvert.SerializeObject(submissionO);
                    }
                    string dojJson = "";

                    if (stop.Status == "fail")
                        dojJson = cr.dojTransform(stop, "U");

                    if (stop.Status == "fatal" || stop.Status == null)
                        dojJson = cr.dojTransform(stop, "I");

                    stop.JsonDojStop = dojJson;
                    db.Entry(stop).State = EntityState.Modified;
                    db.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    throw new HttpResponseException(HttpStatusCode.InternalServerError);
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

        private bool StopExists(int id)
        {
            return db.Stop.Count(e => e.ID == id) > 0;
        }
    }
}