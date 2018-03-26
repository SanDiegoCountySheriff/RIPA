using RIPASTOP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RIPASTOP.Controllers
{
    public class HomeController : Controller
    {
        private RIPASTOPContext db = new RIPASTOPContext();
        public ActionResult Index()
        {
            // Gotta grab the conf table because that is where the NTUserName can be matched.
            UserProfile_Conf UserProfile_Conf = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());           

            if (User.Identity.IsAuthenticated && UserProfile_Conf != null) {
                UserProfile UserProfile = db.UserProfiles.SingleOrDefault(x => x.ID == UserProfile_Conf.UserProfileID);

                ViewBag.officerYearsExperience = UserProfile.Years;
                ViewBag.officerAssignment = UserProfile.Assignment;
                ViewBag.officerAssignmentKey = UserProfile.AssignmentKey;
                ViewBag.officerAssignmentOther = UserProfile.AssignmentOther;
                ViewBag.ori = UserProfile.ORI;
                ViewBag.agency = UserProfile.Agency;
                ViewBag.UserProfileID = UserProfile.ID;

                // web.config debug setting
                ViewBag.debug = HttpContext.IsDebuggingEnabled;

                return View(UserProfile_Conf);
            } else {
                return RedirectToAction("Create", "UserProfiles");
            }
            
        }
    }
}