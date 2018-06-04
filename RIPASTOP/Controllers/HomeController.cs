using RIPASTOP.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace RIPASTOP.Controllers
{
    public class HomeController : Controller
    {
        private RIPASTOPContext db = new RIPASTOPContext();
        public ActionResult Index()
        {
            // Gotta grab the conf table because that is where the NTUserName can be matched.
            UserProfile_Conf UserProfile_Conf = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());

            //string UserId = User.Identity.Name.ToString().ToUpper();
            //if (UserId.IndexOf(@"SDSHERIFF\") > -1)
            //    UserId = UserId.Replace(@"SDSHERIFF\", "");

            //// set up domain context
            //PrincipalContext ctx = new PrincipalContext(ContextType.Domain);

            //// find the group in question
            //GroupPrincipal group = GroupPrincipal.FindByIdentity(ctx, "RIPA Admins");
            //UserPrincipal usr = new UserPrincipal(ctx, UserID);
            //ViewBag.admin = usr;
            //// if found....
            //if (group != null)
            //{
            //    // iterate over members
            //    //foreach (Principal p in group.GetMembers())
            //    //{
            //    //   ViewBag.admin = string.Format("{0}: {1}", p.StructuralObjectClass, p.DisplayName);

            //    //}
            //    ViewBag.admin = usr.SamAccountName;
            //    if (usr.IsMemberOf(group))
            //    {
            //        ViewBag.admin = usr.SamAccountName;
            //    }
            //}

            if (User.Identity.IsAuthenticated && UserProfile_Conf != null) {
                UserProfile UserProfile = db.UserProfiles.SingleOrDefault(x => x.ID == UserProfile_Conf.UserProfileID);

                ViewBag.officerYearsExperience = UserProfile.Years;
                ViewBag.officerAssignment = UserProfile.Assignment;
                ViewBag.officerAssignmentKey = UserProfile.AssignmentKey;
                ViewBag.officerAssignmentOther = UserProfile.AssignmentOther;
                ViewBag.ori = UserProfile.ORI;
                ViewBag.agency = UserProfile.Agency;
                ViewBag.UserProfileID = UserProfile.ID;
                ViewBag.reverseGeoURI = ConfigurationManager.AppSettings["reverseGeoURI"];
                var referer = Request.Headers["Referer"];
                if (referer != null)
                {
                    string refererStr = referer.ToString();
                    if (refererStr.IndexOf("UserProfiles") > -1)
                    {
                        ViewBag.userProfileUpdate = "True";
                    }
                }
                // web.config debug setting
                ViewBag.debug = HttpContext.IsDebuggingEnabled;
                ViewBag.test = ConfigurationManager.AppSettings["test"];
                ViewBag.server = System.Environment.MachineName;


                ViewBag.forceCacheUpdate = ConfigurationManager.AppSettings["forceCacheUpdate"];
                ViewBag.allowedBackDateHours = ConfigurationManager.AppSettings["allowedBackDateHours"];
                ViewBag.useBeats = ConfigurationManager.AppSettings["useBeats"];

                return View(UserProfile_Conf);
            } else {
                return RedirectToAction("Create", "UserProfiles");
            }
            
        }

        
    }
}