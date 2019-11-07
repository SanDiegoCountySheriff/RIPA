using RIPASTOP.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace RIPASTOP.Controllers
{
    public class HomeController : Controller
    {
        private RIPASTOPContext db = new RIPASTOPContext();
        bool proceed;

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
            string domain = string.Format(@"{0}\" ,ConfigurationManager.AppSettings["domain"]);
            if (username.ToUpper().IndexOf(domain) > -1)
            {
                username = username.ToUpper().Replace(domain, "");
            }
            user.authorizedAdmin = UserBelongsToGroup(ConfigurationManager.AppSettings["authorizedAdmin"], username);
            user.authorized = UserBelongsToGroup(ConfigurationManager.AppSettings["authorized"], username);

            return user;
        }
        
        public ActionResult Index()
        {

            UserAuth user = new UserAuth();
            UserProfile_Conf UserProfile_Conf;
            if (ConfigurationManager.AppSettings["requireGroupMembership"] == "true")
            {
                user = AuthorizeUser(User.Identity.Name.ToString());

                if (!user.authorized && !user.authorizedAdmin)
                {
                    //return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);
                    return RedirectToAction("Unauthorized");
                }

                if (User.Identity.IsAuthenticated)
                {
                    proceed = true;
                }
                else
                {
                    proceed = false;
                }
                // Gotta grab the conf table because that is where the NTUserName can be matched.
                UserProfile_Conf = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());
            }
            else{
                // Anonymous user without Authentication can still run this app
                proceed = true;
                UserProfile_Conf = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == "AnonymousUser");
            }

            
            if (proceed && UserProfile_Conf != null)
            {
                UserProfile UserProfile = db.UserProfiles.SingleOrDefault(x => x.ID == UserProfile_Conf.UserProfileID);

                ViewBag.admin = user.authorizedAdmin;
                ViewBag.officerYearsExperience = UserProfile.Years;
                ViewBag.officerAssignment = UserProfile.Assignment;
                ViewBag.officerAssignmentKey = UserProfile.AssignmentKey;
                ViewBag.officerAssignmentOther = UserProfile.AssignmentOther;
                ViewBag.ori = UserProfile.ORI;
                ViewBag.agency = UserProfile.Agency;
                ViewBag.UserProfileID = UserProfile.ID;
                ViewBag.reverseGeoURI = ConfigurationManager.AppSettings["reverseGeoURI"];
                ViewBag.reverseBeatURI = ConfigurationManager.AppSettings["reverseBeatURI"];
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
                ViewBag.expireCacheDays = ConfigurationManager.AppSettings["expireCacheDays"];
                ViewBag.allowedBackDateHours = ConfigurationManager.AppSettings["allowedBackDateHours"];
                ViewBag.useBeats = ConfigurationManager.AppSettings["useBeats"];
                ViewBag.useAdditionalQuestions = ConfigurationManager.AppSettings["useAdditionalQuestions"];
                ViewBag.editStop = 0;
                ViewBag.submissionEdit = 0;

                return View(UserProfile_Conf);
            }
            else
            {
                return RedirectToAction("Create", "UserProfiles");
            }
            
        }
        public ActionResult Unauthorized()
        {
            return View();
        }
        
    }
}