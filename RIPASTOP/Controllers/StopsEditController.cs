using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using RIPASTOP.Models;
using System.DirectoryServices.AccountManagement;
using System.Configuration;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Text.RegularExpressions;

namespace RIPASTOP.Controllers
{
    public class StopsEditController : Controller
    {
        private Entities db = new Entities();
        private RIPASTOPContext dbr = new RIPASTOPContext();
        private EntityState state;


        // GET: StopsEdit
        public ActionResult Index(StopChangeAudits stopChangeAudit, int stopid, int submissionId, string submissionEndDate)
        {
            HomeController.UserAuth user = new HomeController.UserAuth();
            if (ConfigurationManager.AppSettings["requireGroupMembership"] == "true")
            {
                user = HomeController.AuthorizeUser(User.Identity.Name.ToString());

                if (!user.authorizedAdmin)
                {
                    return RedirectToAction("Unauthorized", "Home");
                }
            }

            UserProfile_Conf uid = dbr.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());
            ViewBag.UserProfileID = uid.UserProfileID;
            ViewBag.admin = user.authorizedAdmin;
            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;
            ViewBag.personCount = 0;
            ViewBag.test = ConfigurationManager.AppSettings["test"];

            //If Id is being passed from submission portal
            if (stopid != 0)
            {
                stopChangeAudit.StopID = stopid;
            }
            else
            {
                ViewBag.submissionID = 0;
            }
            ViewBag.submissionID = submissionId;
            ViewBag.submissionEndDate = submissionEndDate;

            if (stopChangeAudit.StopID != 0)
            {
                ViewBag.stopID = stopChangeAudit.StopID;

                string InitStrtSubDate = ConfigurationManager.AppSettings["InitStrtSubDate"];
                DateTime fromDate = Convert.ToDateTime(InitStrtSubDate);
                Stop stop = dbr.Stop
                                    .Where(x => x.ID == stopChangeAudit.StopID && x.Time >= fromDate)
                                    .Select(x => x).FirstOrDefault();

                if (stop == null)
                {
                    ModelState.AddModelError(string.Empty, "The Stop ID you entered does not exists or is older than July 1st 2018!");
                }
                else
                {
                    ViewBag.postSubRedact = stopChangeAudit.postSubRedact;
                    //if (stopChangeAudit.postSubRedact)
                    //{
                    //    stop.Status = "postSubRedact";
                    //    state = dbr.Entry(stop).State;
                    //    dbr.SaveChanges();
                    //}

                    if (stop.Status == "success" && !stopChangeAudit.postSubRedact)
                    {
                        ModelState.AddModelError(string.Empty, "The Stop ID #" + stopChangeAudit.StopID + " has been successfully submitted to DOJ. It cannot be modified.");
                    }
                    else
                    {
                        JObject o = JObject.Parse(stop.JsonStop);
                        JArray personList = (JArray)o["ListPerson_Stopped"];
                        ViewBag.personCount = personList.Count;
                    }

                }
            }

            return View(stopChangeAudit);
        }


        // GET: StopsEdit/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Edit(int? stopid, int pid, int pidCount, int submissionId, string submissionEndDate, bool postSubRedact)
        {
            HomeController.UserAuth user = new HomeController.UserAuth();
            if (ConfigurationManager.AppSettings["requireGroupMembership"] == "true")
            {
                user = HomeController.AuthorizeUser(User.Identity.Name.ToString());

                if (!user.authorizedAdmin)
                {
                    return RedirectToAction("Unauthorized", "Home");
                }
            }

            UserProfile_Conf uid = dbr.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());
            ViewBag.UserProfileID = uid.UserProfileID;
            ViewBag.admin = user.authorizedAdmin;
            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;
            ViewBag.stopID = stopid;
            ViewBag.pid = pid;
            ViewBag.personCount = pidCount;
            ViewBag.submissionID = submissionId;
            ViewBag.submissionEndDate = ViewBag.submissionEndDate;

            if (submissionId == 0)
            {
                ViewBag.submissionEdit = 0;
            }
            else
            {
                ViewBag.submissionEdit = 1;
            }
            ViewBag.submissionEndDate = submissionEndDate;

            ViewBag.expireCacheDays = ConfigurationManager.AppSettings["expireCacheDays"];
            ViewBag.reverseGeoURI = ConfigurationManager.AppSettings["reverseGeoURI"];
            ViewBag.reverseBeatURI = ConfigurationManager.AppSettings["reverseBeatURI"];
            ViewBag.server = System.Environment.MachineName;
            ViewBag.forceCacheUpdate = ConfigurationManager.AppSettings["forceCacheUpdate"];
            ViewBag.allowedBackDateHours = ConfigurationManager.AppSettings["allowedBackDateHours"];
            ViewBag.useBeats = ConfigurationManager.AppSettings["useBeats"];
            ViewBag.test = ConfigurationManager.AppSettings["test"];
            ViewBag.useAdditionalQuestions = ConfigurationManager.AppSettings["useAdditionalQuestions"];
            ViewBag.useContractCity = ConfigurationManager.AppSettings["useContractCity"];
            ViewBag.useContractEvent = ConfigurationManager.AppSettings["useContractEvent"];
            ViewBag.editStop = 1;
            ViewBag.postSubRedact = postSubRedact;

            return View();
        }

        //[HttpPost]
        //public ActionResult postSubRedaction(int StopId, bool postSubRedact)
        //{
        //    if (postSubRedact)
        //    {
        //        DateTime fromDate = Convert.ToDateTime("2018-07-01");
        //        Stop stop = dbr.Stop
        //            .Where(x => x.ID == StopId && x.Time >= fromDate)
        //            .Select(x => x).FirstOrDefault();

        //        if (stop == null)
        //        {
        //            ModelState.AddModelError(string.Empty, "The Stop ID you entered does not exists or is older than July 1st 2018!");
        //        }
        //        else
        //        {
        //            stop.Status = "postSubRedact";
        //            state = dbr.Entry(stop).State;
        //            dbr.SaveChanges();
        //        }
        //    }
        //    return View();
        //}


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
