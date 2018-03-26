using RIPASTOP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RIPASTOP.Controllers
{
    public class RegulationController : Controller
    {
        private RIPASTOPContext db = new RIPASTOPContext();
        // GET: Regulation
        public ActionResult Index()
        {
            UserProfile_Conf uid = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());
            ViewBag.UserProfileID = uid.UserProfileID;
            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;
            return View();
        }
    }
}