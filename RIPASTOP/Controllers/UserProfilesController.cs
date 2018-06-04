using System;
using System.Collections.Generic;
using System.Configuration;
//using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using RIPASTOP.Models;

namespace RIPASTOP.Controllers
{
    public class UserProfilesController : Controller
    {
        private RIPASTOPContext db = new RIPASTOPContext();

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
            UserProfile_Conf UserProfile_Conf = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());

            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;
            ViewBag.agency = ConfigurationManager.AppSettings["agency"];
            ViewBag.ori = ConfigurationManager.AppSettings["ori"];           


            if (User.Identity.IsAuthenticated && UserProfile_Conf == null)
            {
                return View();
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
        public ActionResult Create([Bind(Include = "ID,Agency,ORI,Years,Assignment,AssignmentOther")] UserProfile userProfile)
        {
            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;

            if (ModelState.IsValid && User.Identity.IsAuthenticated)
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
                            return View();
                        }
                        if (userProfile.AssignmentOther.Length < 3)
                        {
                            ViewBag.ErrorOtherType = "Please enter at least 3 characters for this field.";
                            return View();
                        }
                    }
                    
                }
               
                    userProfile.Agency = ConfigurationManager.AppSettings["agency"];
                    userProfile.ORI = ConfigurationManager.AppSettings["ori"];
               

                db.UserProfiles.Add(userProfile);
                db.UserProfile_Conf.Add(
                    new UserProfile_Conf() {
                        NTUserName = User.Identity.Name,
                        UserProfileID = userProfile.ID
                    }
                );
                db.SaveChanges();
                return RedirectToAction("Index", "Home");
            }

            //return RedirectToAction("Index", "Home");
            //return View(userProfile);
            return View();
        }

        // GET: UserProfiles/Edit/5
        public ActionResult Edit(int? id)
        {
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
        public ActionResult Edit([Bind(Include = "ID,Agency,ORI,Years,Assignment,AssignmentOther")] UserProfile userProfile)
        {
            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;
            if (ModelState.IsValid)
            {
                if (!string.IsNullOrEmpty(userProfile.Assignment)) {
                    userProfile.AssignmentKey = Int32.Parse(userProfile.Assignment.Substring(0, userProfile.Assignment.IndexOf(' ')));
                    userProfile.Assignment = userProfile.Assignment.Substring(userProfile.Assignment.IndexOf(' ') + 1, userProfile.Assignment.Length - userProfile.Assignment.IndexOf(' ') - 1);
                    if(userProfile.AssignmentKey != 10)
                    {
                        userProfile.AssignmentOther = null;
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(userProfile.AssignmentOther))
                        {
                            ViewBag.ErrorOtherType = "Please enter a description for assignment";
                            return View();
                        }
                        if (userProfile.AssignmentOther.Length < 3)
                        {
                            ViewBag.ErrorOtherType = "Please enter at least 3 characters for this field.";
                            return View();
                        }
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
