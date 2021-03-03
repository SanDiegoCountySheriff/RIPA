using RIPASTOP.Models;
using System;
using System.Configuration;
//using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web.Mvc;

namespace RIPASTOP.Controllers
{
    public class UserProfilesController : Controller
    {
        private RIPASTOPContext db = new RIPASTOPContext();
        private Entities dbl = new Entities();
        bool proceed;

        // GET: UserProfiles
        public ActionResult Index()
        {
            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;

            return RedirectToAction("Index", "Home");
        }

        //// GET: UserProfiles/Details/5
        //public ActionResult Details(Guid? id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    UserProfile userProfile = db.UserProfiles.Find(id);
        //    if (userProfile == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(userProfile);
        //}


        // GET: UserProfiles/Create
        public ActionResult Create()
        {
            UserProfile_Conf UserProfile_Conf;
            HomeController.UserAuth user = new HomeController.UserAuth();

            if (ConfigurationManager.AppSettings["requireGroupMembership"] == "true")
            {
                user = HomeController.AuthorizeUser(User.Identity.Name.ToString());

                if (!user.authorized && !user.authorizedAdmin)
                {
                    //return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);
                    return RedirectToAction("Unauthorized", "Home");
                }
                if (User.Identity.IsAuthenticated)
                {
                    proceed = true;
                }
                else
                {
                    proceed = false;
                }
                UserProfile_Conf = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());
            }
            else
            {
                // Anonymous user without Authentication can still run this app
                proceed = true;
                UserProfile_Conf = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == "AnonymousUser");
            }


            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;
            ViewBag.agency = ConfigurationManager.AppSettings["agency"];
            ViewBag.ori = ConfigurationManager.AppSettings["ori"];
            //ViewBag.useContractCity = Convert.ToBoolean(ConfigurationManager.AppSettings["useContractCity"] == "1" ? true : false);
            string useContractCity = ConfigurationManager.AppSettings["useContractCity"];
            ViewBag.useContractCity = useContractCity;
            ViewBag.useContractEvent = ConfigurationManager.AppSettings["useContractEvent"];
            ViewBag.admin = user.authorizedAdmin;
            UserProfile usrProf = new UserProfile();

            if (proceed && UserProfile_Conf == null)
            {
                if (useContractCity == "1")
                {
                    //create SelectListItem
                    usrProf.citiesList = dbl.ContractCities.
                                               Select(a => new SelectListItem
                                               {
                                                   Text = a.ContractCity.ToString().Trim(), // name to show in html dropdown
                                                   Value = a.ContractCity.ToString().Trim(), // value of html dropdown
                                                                                             //Selected = (a.City.ToString().Trim() == "ACAMPO")
                                               }).ToList();
                }

                return View(usrProf);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        // POST: UserProfiles/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ID,Agency,ORI,Years,Assignment,AssignmentOther,ContractFundedPosition,ContractCity,ContractFundedEvent,citiesList")] UserProfile userProfile)
        {
            string userName;

            HomeController.UserAuth user = new HomeController.UserAuth();
            if (ConfigurationManager.AppSettings["requireGroupMembership"] == "true")
            {
                user = HomeController.AuthorizeUser(User.Identity.Name.ToString());

                if (!user.authorized && !user.authorizedAdmin)
                {
                    //return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);
                    return RedirectToAction("Unauthorized", "Home");
                }
                if (User.Identity.IsAuthenticated)
                {
                    proceed = true;
                }
                else
                {
                    proceed = false;
                }
                userName = User.Identity.Name;
            }
            else
            {
                proceed = true;
                userName = "AnonymousUser";
            }
            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;
            ViewBag.admin = user.authorizedAdmin;
            string useContractCity = ConfigurationManager.AppSettings["useContractCity"];
            ViewBag.useContractCity = useContractCity;
            ViewBag.useContractEvent = ConfigurationManager.AppSettings["useContractEvent"];
            if (useContractCity == "1")
            {
                //create SelectListItem
                userProfile.citiesList = dbl.ContractCities.
                                           Select(a => new SelectListItem
                                           {
                                               Text = a.ContractCity.ToString().Trim(), // name to show in html dropdown
                                               Value = a.ContractCity.ToString().Trim(), // value of html dropdown
                                           }).ToList();
            }

            if (ModelState.IsValid && proceed)
            {
                //userProfile.ID = Guid.NewGuid();
                if (!string.IsNullOrEmpty(userProfile.Assignment))
                {
                    userProfile.AssignmentKey = Int32.Parse(userProfile.Assignment.Substring(0, userProfile.Assignment.IndexOf(' ')));
                    userProfile.Assignment = userProfile.Assignment.Substring(userProfile.Assignment.IndexOf(' ') + 1, userProfile.Assignment.Length - userProfile.Assignment.IndexOf(' ') - 1);
                    if (userProfile.AssignmentKey != 10)
                    {
                        userProfile.AssignmentOther = null;
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(userProfile.AssignmentOther))
                        {
                            ViewBag.ErrorOtherType = "Please enter a description for assignment";
                            return View(userProfile);
                        }
                        if (userProfile.AssignmentOther.Length < 3)
                        {
                            ViewBag.ErrorOtherType = "Please enter at least 3 characters for this field.";
                            return View(userProfile);
                        }
                    }

                }


                if (userProfile.ContractFundedPosition == true)
                {
                    if (string.IsNullOrEmpty(userProfile.ContractCity))
                    {
                        ViewBag.ErrorOtherType = "Please select a contracted city";
                        return View(userProfile);
                    }
                }
                else
                {
                    if (!string.IsNullOrEmpty(userProfile.ContractCity))
                    {
                        ViewBag.ErrorOtherType = "Please select true for Position Contract Funded";
                        return View(userProfile);
                    }

                }

                userProfile.Agency = ConfigurationManager.AppSettings["agency"];
                userProfile.ORI = ConfigurationManager.AppSettings["ori"];


                db.UserProfiles.Add(userProfile);
                db.UserProfile_Conf.Add(
                    new UserProfile_Conf()
                    {
                        NTUserName = userName,
                        UserProfileID = userProfile.ID
                    }
                );
                db.SaveChanges();
                return RedirectToAction("Index", "Home");
            }

            //return RedirectToAction("Index", "Home");
            //return View(userProfile);
            return View(userProfile);
        }

        // GET: UserProfiles/Edit/5
        public ActionResult Edit(int? id)
        {
            HomeController.UserAuth user = new HomeController.UserAuth();
            if (ConfigurationManager.AppSettings["requireGroupMembership"] == "true")
            {
                user = HomeController.AuthorizeUser(User.Identity.Name.ToString());

                if (!user.authorized && !user.authorizedAdmin)
                {
                    //return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);
                    return RedirectToAction("Unauthorized", "Home");
                }
            }
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserProfile userProfile = db.UserProfiles.Find(id);
            if (userProfile == null)
            {
                return HttpNotFound();
            }
            ViewBag.UserProfileID = userProfile.ID;
            ViewBag.admin = user.authorizedAdmin;
            string useContractCity = ConfigurationManager.AppSettings["useContractCity"];
            ViewBag.useContractCity = useContractCity;
            ViewBag.useContractEvent = ConfigurationManager.AppSettings["useContractEvent"];

            if (useContractCity == "1")
            {
                //create SelectListItem
                userProfile.citiesList = dbl.ContractCities.
                                           Select(a => new SelectListItem
                                           {
                                               Text = a.ContractCity.ToString().Trim(), // name to show in html dropdown
                                               Value = a.ContractCity.ToString().Trim(), // value of html dropdown
                                           }).ToList();
            }

            if (!string.IsNullOrEmpty(userProfile.Assignment))
            {
                userProfile.Assignment = string.Format("{0} {1}", userProfile.AssignmentKey, userProfile.Assignment);
            }
            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;
            return View(userProfile);
        }

        // POST: UserProfiles/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "ID,Agency,ORI,Years,Assignment,AssignmentOther,ContractFundedPosition,ContractCity,ContractFundedEvent,citiesList")] UserProfile userProfile)
        {
            HomeController.UserAuth user = new HomeController.UserAuth();
            if (ConfigurationManager.AppSettings["requireGroupMembership"] == "true")
            {
                user = HomeController.AuthorizeUser(User.Identity.Name.ToString());

                if (!user.authorized && !user.authorizedAdmin)
                {
                    //return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);
                    return RedirectToAction("Unauthorized", "Home");
                }
            }
            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;
            ViewBag.admin = user.authorizedAdmin;
            string useContractCity = ConfigurationManager.AppSettings["useContractCity"];
            ViewBag.useContractCity = useContractCity;
            ViewBag.useContractEvent = ConfigurationManager.AppSettings["useContractEvent"];

            if (useContractCity == "1")
            {
                //create SelectListItem
                userProfile.citiesList = dbl.ContractCities.
                                           Select(a => new SelectListItem
                                           {
                                               Text = a.ContractCity.ToString().Trim(), // name to show in html dropdown
                                               Value = a.ContractCity.ToString().Trim(), // value of html dropdown
                                           }).ToList();
            }


            if (ModelState.IsValid)
            {
                if (!string.IsNullOrEmpty(userProfile.Assignment))
                {
                    userProfile.AssignmentKey = Int32.Parse(userProfile.Assignment.Substring(0, userProfile.Assignment.IndexOf(' ')));
                    userProfile.Assignment = userProfile.Assignment.Substring(userProfile.Assignment.IndexOf(' ') + 1, userProfile.Assignment.Length - userProfile.Assignment.IndexOf(' ') - 1);
                    if (userProfile.AssignmentKey != 10)
                    {
                        userProfile.AssignmentOther = null;
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(userProfile.AssignmentOther))
                        {
                            ViewBag.ErrorOtherType = "Please enter a description for assignment";
                            return View(userProfile);
                        }
                        if (userProfile.AssignmentOther.Length < 3)
                        {
                            ViewBag.ErrorOtherType = "Please enter at least 3 characters for this field.";
                            return View(userProfile);
                        }
                    }
                }


                if (userProfile.ContractFundedPosition == true)
                {
                    if (string.IsNullOrEmpty(userProfile.ContractCity))
                    {
                        ViewBag.ErrorOtherType = "Please select a contracted city";
                        return View(userProfile);
                    }
                }
                else
                {
                    if (!string.IsNullOrEmpty(userProfile.ContractCity))
                    {
                        ViewBag.ErrorOtherType = "Please select true for Position Contract Funded";
                        return View(userProfile);
                    }

                }
                userProfile.Agency = ConfigurationManager.AppSettings["agency"];
                userProfile.ORI = ConfigurationManager.AppSettings["ori"];

                db.Entry(userProfile).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            // web.config debug setting
            //ViewBag.debug = HttpContext.IsDebuggingEnabled;
            return View(userProfile);
        }

        //// GET: UserProfiles/Delete/5
        //public ActionResult Delete(Guid? id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    UserProfile userProfile = db.UserProfiles.Find(id);
        //    if (userProfile == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(userProfile);
        //}

        //// POST: UserProfiles/Delete/5
        //[HttpPost, ActionName("Delete")]
        //[ValidateAntiForgeryToken]
        //public ActionResult DeleteConfirmed(Guid id)
        //{
        //    UserProfile userProfile = db.UserProfiles.Find(id);
        //    db.UserProfiles.Remove(userProfile);
        //    db.SaveChanges();
        //    return RedirectToAction("Index");
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
