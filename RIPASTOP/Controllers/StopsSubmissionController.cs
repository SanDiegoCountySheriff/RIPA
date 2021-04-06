using RIPASTOP.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace RIPASTOP.Controllers
{
    public class StopsSubmissionController : Controller
    {
        private RIPASTOPContext db = new RIPASTOPContext();
        private Entities entitiesdb = new Entities();
        private DateTime startDate;

        public partial class UserAuth
        {
            public bool authorized { get; set; }
            public bool authorizedAdmin { get; set; }
        }
        public static bool UserBelongsToGroup(string group, string username)
        {
            PrincipalContext pc = new PrincipalContext(ContextType.Domain, ConfigurationManager.AppSettings["domain"]);
            GroupPrincipal gp = GroupPrincipal.FindByIdentity(pc, group);
            UserPrincipal up = UserPrincipal.FindByIdentity(pc, username);
            if (gp == null)
            {
                return false;
            }
            else
            {
                return up.IsMemberOf(gp);
            }
        }

        public static UserAuth AuthorizeUser(string username)
        {
            UserAuth user = new UserAuth();
            string domain = string.Format(@"{0}\", ConfigurationManager.AppSettings["domain"]);
            if (username.ToUpper().IndexOf(domain) > -1)
            {
                username = username.ToUpper().Replace(domain, "");
            }
            user.authorizedAdmin = UserBelongsToGroup(ConfigurationManager.AppSettings["authorizedAdmin"], username);

            return user;
        }

        // GET: Admin
        public ActionResult Index(int? sid)
        {

            UserAuth user = new UserAuth();
            ViewBag.server = System.Environment.MachineName;

            user = AuthorizeUser(User.Identity.Name.ToString());

            if (!user.authorizedAdmin)
            {
                return RedirectToAction("Unauthorized", "Home");
            }

            UserProfile_Conf uid = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());
            ViewBag.UserProfileID = uid.UserProfileID;
            ViewBag.admin = user.authorizedAdmin;
            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;

            // Check if there are "Pending Fixes" before allowing them to submit again
            if (sid != 0)
            {
                Submissions submitedRec = entitiesdb.Submissions.Find(sid);
                //Submissions submitedRec = entitiesdb.Submissions
                //                            .Where(x => x.Status == "Pending Fixes")
                //                            .OrderByDescending(x => x.ID)
                //                            .Select(x => x).FirstOrDefault();
                if (submitedRec != null)
                {
                    return RedirectToAction("SubmissionStatusGet", "StopsSubmission", new { sid = submitedRec.ID, endDate = submitedRec.EndDate });
                }
            }

            Submissions dateRec = entitiesdb.Submissions
                            .OrderByDescending(x => x.EndDate)
                            .Select(x => x).FirstOrDefault();
            if (dateRec != null)
            {
                startDate = Convert.ToDateTime(dateRec.EndDate).AddDays(1);
            }
            else
            {
                string InitStrtSubDate = ConfigurationManager.AppSettings["InitStrtSubDate"];
                startDate = Convert.ToDateTime(InitStrtSubDate);
            }
            //List<Stop> Stops = db.Stop
            //        .Where(x => x.Status.Trim() != "success").ToList();
            //ExtractJNode eJson;
            //foreach (Stop st in Stops)
            //{
            //    //extract date from JsonStop
            //    JObject JsonStopO;
            //    JsonStopO = JObject.Parse(st.JsonStop);
            //    eJson = new ExtractJNode("date", JsonStopO);
            //    startDate = Convert.ToDateTime(eJson.traverseNode());

            //    // Only stops after July 1st 2018 should be submitted
            //    //if (startDate >= Convert.ToDateTime("2018-07-01"))
            //    if (startDate >= Convert.ToDateTime("2018-04-17"))
            //    {
            //        break;
            //    }
            //}
            Submissions submission = new Submissions();
            if (startDate.ToString() == "1/1/0001 12:00:00 AM")
            {
                ModelState.AddModelError(string.Empty, "There are no records to submit");
            }
            else
            {
                submission.StartDate = startDate;
                ViewBag.StartDate = startDate.ToString();
                if (TempData["CustomError"] != null)
                {
                    ModelState.AddModelError(string.Empty, TempData["CustomError"].ToString());
                }
            }
            submission.subList = entitiesdb.Submissions
                                    .OrderByDescending(x => x.StartDate)
                                    .ThenByDescending(y => y.DateSubmitted).ToList();

            return View(submission);
        }


        public ActionResult SubmissionStatusGet(int? sid, DateTime? endDate)
        {
            UserAuth user = new UserAuth();
            ViewBag.server = System.Environment.MachineName;
            DataSet dsStop = new DataSet();

            user = AuthorizeUser(User.Identity.Name.ToString());

            if (!user.authorizedAdmin)
            {
                return RedirectToAction("Unauthorized", "Home");
            }

            UserProfile_Conf uid = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());
            ViewBag.UserProfileID = uid.UserProfileID;
            ViewBag.admin = user.authorizedAdmin;

            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;

            Submissions submission = entitiesdb.Submissions.Find(sid);
            if (endDate == null)
            {
                endDate = submission.EndDate;
            }
            ViewBag.submissionEndDate = endDate;

            if (endDate < submission.StartDate || endDate > DateTime.Now)
            {
                TempData["CustomError"] = "Invalid Date Range";
                return RedirectToAction("Index", "StopsSubmission", sid);
            }
            else
            {
                submission.statusMsgs = entitiesdb.StatusMessage_JSON_vw
                        .Where(x => x.submissionID == sid && x.StopStatus != "success" && x.StopStatus != "postSubRedact")
                        .ToList();
                submission.subList = entitiesdb.Submissions
                                .Where(x => x.StartDate == submission.StartDate &&
                                            x.EndDate == submission.EndDate).ToList();
            }
            bool fixedFlag = false;



            SQLDBDataAccessorClass sql = new SQLDBDataAccessorClass();
            string sqlStr = "";
            sqlStr = "Select * from Stops" +
                     " Where SubmissionsID = " + submission.ID +
                     " and Status != '" + "success' " +
                     " and JsonSubmissions is not null " +
                     " and Right(JsonSubmissions, 15) like '%true%'";
            dsStop = sql.mds_ExecuteQuery(sqlStr, "StopsTbl");
            int rowsCount = dsStop.Tables["StopsTbl"].Rows.Count;

            if (rowsCount != 0)
            {
                fixedFlag = true;
            }


           sql = new SQLDBDataAccessorClass();

            sqlStr = "";
            sqlStr = "SELECT * FROM Stops as S " +
                     "INNER JOIN StopOfficerIDDateTime_JSON_vw as J ON J.ID = S.ID " +
                     " Where CONVERT(datetime, '" + submission.StartDate + "') <= J.stopDate and J.stopDate <= CONVERT(datetime, '" + endDate + "')";

            dsStop = sql.mds_ExecuteQuery(sqlStr, "StopOfficeVWTbl");
            int stopsCount = dsStop.Tables["StopOfficeVWTbl"].Rows.Count;

            ViewBag.fixedFlag = fixedFlag;
            ViewBag.totalStops = stopsCount;

            return View(submission);
        }

        // POST: StopsSubmission/SubmissionStats
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SubmissionStats(Submissions submission, int? sid, DateTime startDate, DateTime? endDate)
        {
            UserAuth user = new UserAuth();
            DataSet dsStop = new DataSet();

            user = AuthorizeUser(User.Identity.Name.ToString());

            if (!user.authorizedAdmin)
            {
                return RedirectToAction("Unauthorized", "Home");
            }

            if (ModelState.IsValid)
            {
                UserProfile_Conf uid = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());
                ViewBag.UserProfileID = uid.UserProfileID;
                ViewBag.admin = user.authorizedAdmin;

                // web.config debug setting
                ViewBag.debug = HttpContext.IsDebuggingEnabled;
                ViewBag.submissionEndDate = endDate;
                DOJSubmitController dOJSubmit = new DOJSubmitController();

                //Make sure the connection to DOJ url is available
                //DOJSubmitController.connectionStatus connectStat = dOJSubmit.HTTP_Connection();
                //if (!connectStat.connected)
                //{
                //    TempData["CustomError"] = connectStat.error;
                //    return RedirectToAction("Index", "StopsSubmission", sid);
                //}

                bool connected = dOJSubmit.HTTP_Connection2();
                if (!connected)
                {
                    TempData["CustomError"] = "Can not connect to DOJ endpoint\r\n";
                    return RedirectToAction("Index", "StopsSubmission", sid);
                }
                // If submission record in this date range is In Progress do not allow another submission
                Submissions submissionInProgress = entitiesdb.Submissions
                                .Where(x => x.StartDate == startDate && x.EndDate == endDate && x.Status == "In Progress")
                                .FirstOrDefault();

                if (submissionInProgress != null)
                {
                    TempData["CustomError"] = "A submission in this date range is already 'In Progress'";
                    return RedirectToAction("Index", "StopsSubmission", sid);
                }

                if (sid != 0)
                {
                    Submissions submissionOld = entitiesdb.Submissions.Find(sid);
                    if (submissionOld.TotalHTTPErrors == 0 || submissionOld.TotalHTTPErrors == null)
                    {
                        submission = submissionOld;
                    }
                }
                submission.StartDate = startDate;
                if (endDate < submission.StartDate || endDate > DateTime.Now)
                {
                    TempData["CustomError"] = "Invalid Date Range";
                    return RedirectToAction("Index", "StopsSubmission", sid);
                }
                else
                {

                    bool fixedFlag = false;

                    SQLDBDataAccessorClass sql = new SQLDBDataAccessorClass();
                    string sqlStr = "";
                    sqlStr = "Select * from Stops" +
                             " Where SubmissionsID = " + submission.ID +
                             " and JsonSubmissions is not null " +
                             " and Right(JsonSubmissions, 15) like '%true%'";
                    dsStop = sql.mds_ExecuteQuery(sqlStr, "StopsTbl");
                    int rowsCount = dsStop.Tables["StopsTbl"].Rows.Count;

                    if (rowsCount != 0)
                    {
                            fixedFlag = true;
                    }

                    ViewBag.fixedFlag = fixedFlag;

                    // Change the status of the current submission record, with edited Stops, to "resumbit", 
                    // and create a new submission record to Resubmit all the fixed records again
                    if (rowsCount != 0)
                    {
                        submission.Status = "Resubmit";
                        if (ModelState.IsValid)
                        {
                            entitiesdb.Entry(submission).State = EntityState.Modified;
                            await entitiesdb.SaveChangesAsync();
                        }
                        Submissions newSubmission = new Submissions();
                        newSubmission.StartDate = submission.StartDate;
                        submission = newSubmission;
                    }
                    submission.Status = "In Progress";
                    submission.DateSubmitted = DateTime.Now;
                    submission.EndDate = endDate;

                    var state = await dOJSubmit.GetStops(submission);
                    entitiesdb.Entry(submission).State = state;

                    if (submission.TotalProcessed == submission.TotalSuccess)
                    {
                        submission.Status = "Finished";
                    }
                    else
                    {
                        submission.Status = "Pending Fixes";
                        submission.statusMsgs = entitiesdb.StatusMessage_JSON_vw
                                .Where(x => x.submissionID == submission.ID && x.StopStatus != "success" && x.StopStatus != "postSubRedact")
                                .ToList();
                        submission.subList = entitiesdb.Submissions.ToList();

                    }
                    //If ModelState.IsValid is not True this might 
                    //cause submission to stay in 'In Progress' status
                    // 
                    //if (ModelState.IsValid)
                    //{
                    //state = entitiesdb.Entry(submission).State;
                    //entitiesdb.Entry(submission).State = EntityState.Modified;
                    entitiesdb.SaveChanges();
                    ViewBag.submissionID = submission.ID;

                    //}

                }
            }
            else
            {
                TempData["CustomError"] = "End Date is required.";
            }


            return RedirectToAction("Index", "StopsSubmission", submission.ID);
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
                entitiesdb.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
