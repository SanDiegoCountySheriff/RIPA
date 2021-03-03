using RIPASTOP.Models;
using System.Configuration;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Web.Mvc;

namespace RIPASTOP.Controllers
{
    public class RegulationController : Controller
    {
        private RIPASTOPContext db = new RIPASTOPContext();

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
            user.authorized = UserBelongsToGroup(ConfigurationManager.AppSettings["authorized"], username);

            return user;
        }
        // GET: Regulation
        public ActionResult Index()
        {
            UserProfile_Conf UserProfile_Conf;
            UserAuth user = new UserAuth();
            if (ConfigurationManager.AppSettings["requireGroupMembership"] == "true")
            {
                user = AuthorizeUser(User.Identity.Name.ToString());

                if (!user.authorized && !user.authorizedAdmin)
                {
                    //return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);
                    return RedirectToAction("Unauthorized");
                }
                // Gotta grab the conf table because that is where the NTUserName can be matched.
                UserProfile_Conf = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());
            }
            else
            {
                // Anonymous user without Authentication can still run this app
                UserProfile_Conf = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == "AnonymousUser");
            }



            if (User.Identity.IsAuthenticated && UserProfile_Conf != null)
            {
                UserProfile UserProfile = db.UserProfiles.SingleOrDefault(x => x.ID == UserProfile_Conf.UserProfileID);

                ViewBag.admin = user.authorizedAdmin;
            }

            //UserProfile_Conf uid = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());
            ViewBag.UserProfileID = UserProfile_Conf.UserProfileID;
            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;
            return View();
        }
    }
}