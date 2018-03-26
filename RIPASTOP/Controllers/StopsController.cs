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
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace RIPASTOP.Controllers
{
    //[Authorize]
    public class StopsController : Controller
    {
        private RIPASTOPContext db = new RIPASTOPContext();

        // GET: Stops
        public async Task<ActionResult> Index()
        {
            UserProfile_Conf uid = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());
            ViewBag.UserProfileID = uid.UserProfileID;
            List<Stop> Stops = await db.Stop.Where(x => x.UserProfileID == uid.UserProfileID).OrderByDescending(x => x.Time).ToListAsync();
            foreach(Stop st in Stops)
            {
                st.JsonStop = JValue.Parse(st.JsonStop).ToString(Formatting.Indented);
            }

            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;

            return View(Stops);
        }

        // GET: Stops/Details/5
        public async Task<ActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Stop stop = await db.Stop.FindAsync(id);
            if (stop == null)
            {
                return HttpNotFound();
            }

            // web.config debug setting
            ViewBag.debug = HttpContext.IsDebuggingEnabled;

            return View(stop);
        }

        // GET: Stops/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Stops/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        //[ValidateAntiForgeryToken]
        //[AllowAnonymous]
        public async Task<ActionResult> Create([Bind(Include = "ID,JsonStop,JsonInstrumentation,latitude,longitude,beat,UserProfileID,PersonCount")] Stop stop)
        {
            UserProfile_Conf uid = db.UserProfile_Conf.SingleOrDefault(x => x.NTUserName == User.Identity.Name.ToString());

            //stop.ID = Guid.NewGuid();
            stop.Time = DateTime.Now;
            stop.Latitude = string.IsNullOrEmpty(stop.Latitude) ? null : stop.Latitude;
            stop.Longitude = string.IsNullOrEmpty(stop.Longitude) ? null : stop.Longitude;
            stop.Beat = string.IsNullOrEmpty(stop.Beat) ? null : stop.Beat;
            stop.UserProfileID = uid.UserProfileID;

            //Todo: Map JsonStop to DojStop 

            db.Stop.Add(stop);

            //await db.SaveChangesAsync();
            //return RedirectToAction("Index");
           
            try
            {
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError); 
            }

        }

        //// GET: Stops/Edit/5
        //public async Task<ActionResult> Edit(Guid? id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    Stop stop = await db.Stop.FindAsync(id);
        //    if (stop == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(stop);
        //}

        //// POST: Stops/Edit/5
        //// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        //// more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<ActionResult> Edit([Bind(Include = "ID,JsonPayload,latitude,longitude,beat,UserProfileID")] Stop stop)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        db.Entry(stop).State = EntityState.Modified;
        //        await db.SaveChangesAsync();
        //        return RedirectToAction("Index");
        //    }
        //    return View(stop);
        //}

        // GET: Stops/Delete/5
        //public async Task<ActionResult> Delete(Guid? id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    Stop stop = await db.Stop.FindAsync(id);
        //    if (stop == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(stop);
        //}

        //// POST: Stops/Delete/5
        //[HttpPost, ActionName("Delete")]
        //[ValidateAntiForgeryToken]
        //public async Task<ActionResult> DeleteConfirmed(Guid id)
        //{
        //    Stop stop = await db.Stop.FindAsync(id);
        //    db.Stop.Remove(stop);
        //    await db.SaveChangesAsync();
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
