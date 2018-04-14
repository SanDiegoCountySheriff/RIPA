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
using System.Web.Script.Serialization;
using System.Globalization;

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
            //stop.JsonDojStop = dojTransform(stop.JsonStop);

            db.Stop.Add(stop);

            //await db.SaveChangesAsync();
            //return RedirectToAction("Index");
           
            try
            {
                db.SaveChanges();
                //return RedirectToAction("Index");
                string dojJson = dojTransform(stop);
                stop.JsonDojStop = dojJson;
                db.Entry(stop).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError);
            }

        }

        public string dojTransform(Stop stop)
        {
            ExtractJNode eJson, deJson;

            string jsonStop = stop.JsonStop;

            try
            {

                JObject o = JObject.Parse(jsonStop);
                eJson = new ExtractJNode("ori", o);
                string ori = eJson.traverseNode();
                eJson = new ExtractJNode("date", o);
                string date = eJson.traverseNode();
                date = DateTime.Parse(date).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture);
                eJson = new ExtractJNode("time", o);
                string time = eJson.traverseNode();
                eJson = new ExtractJNode("stopDuration", o);
                string stopDuration = eJson.traverseNode();
                eJson = new ExtractJNode("officerID", o);
                string officerID = eJson.traverseNode();
                eJson = new ExtractJNode("ExpYears", o);
                string ExpYears = eJson.traverseNode();
                eJson = new ExtractJNode("officerAssignment.key", o);
                string OFKey = eJson.traverseNode();
                eJson = new ExtractJNode("officerAssignment.otherType", o);
                string OFOtherType = eJson.traverseNode();

                eJson = new ExtractJNode("location.intersection", o);
                string intersection = eJson.traverseNode();
                eJson = new ExtractJNode("location.blockNumber", o);
                string blockNumber = eJson.traverseNode();
                eJson = new ExtractJNode("location.landMark", o);
                string landMark = eJson.traverseNode();
                eJson = new ExtractJNode("location.streetName", o);
                string streetName = eJson.traverseNode();
                eJson = new ExtractJNode("location.highwayExit", o);
                string highwayExit = eJson.traverseNode();

                // Generate Location
                string location = intersection;
                if (blockNumber != "")
                    location += " " + blockNumber;
                if (landMark != "")
                    location += " " + landMark;
                if (streetName != "")
                    location += " " + streetName;
                if (highwayExit != "")
                    location += " " + highwayExit;
                eJson = new ExtractJNode("location.city.codes.code", o);
                string city = eJson.traverseNode();

                eJson = new ExtractJNode("location.school", o);
                string isSchool = "";

                if (eJson.traverseNode() == "True")
                {
                    isSchool = "Y";
                }
                eJson = new ExtractJNode("location.schoolName.codes.code", o);
                string schoolNameCode = eJson.traverseNode();

                eJson = new ExtractJNode("stopInResponseToCFS", o);
                string stopInResponseToCFS = "N";

                if (eJson.traverseNode() == "True")
                {
                    stopInResponseToCFS = "Y";
                }

                JObject jsonObject = JObject.FromObject(new
                {
                    //stopdatarecord = new
                    //{
                    LEARecordID = stop.ID.ToString(),
                    BatchID = "",
                    ORI = ori,
                    TX_Type = "I",
                    Is_NFIA = "",
                    SDate = date,
                    STime = time,
                    SDur = stopDuration,
                    Officer = new
                    {
                        UID = officerID,
                        Proxy = "",
                        ExpYears,
                        AT = OFKey,
                        ATOth = OFOtherType,
                    },
                    Location = new
                    {
                        Loc = location,
                        City = city,
                        K12_Flag = isSchool,
                        K12Code = schoolNameCode,
                    },
                    Is_ServCall = stopInResponseToCFS,
                    ListPerson_Stopped = new
                    {
                        Person_Stopped = new JArray(),
                    }
                });
                string jString = JsonConvert.SerializeObject(jsonObject);

                JArray personList = (JArray)o["ListPerson_Stopped"];

                JObject stopdatarecord = (JObject)jsonObject["ListPerson_Stopped"];

                int pid = 0;
                int i = 0;
                foreach (JObject item in personList)
                {
                    //eJson = new ExtractJNode("PID", item);
                    //string PID = eJson.traverseNode();
                    pid++;

                    eJson = new ExtractJNode("perceivedRace.key", item);
                    string pRace = eJson.traverseNode();
                    string[] ethnList = pRace.Split(',');

                    eJson = new ExtractJNode("perceivedAge", item);
                    string perceivedAge = eJson.traverseNode();

                    eJson = new ExtractJNode("perceivedLimitedEnglish", item);
                    string perceivedLimitedEnglish = "N";
                    if (eJson.traverseNode() == "True")
                    {
                        perceivedLimitedEnglish = "Y";
                    }

                    eJson = new ExtractJNode("perceivedOrKnownDisability.key", item);
                    string prcvDisability = eJson.traverseNode();
                    string[] prcvDisabltyList = prcvDisability.Split(',');

                    eJson = new ExtractJNode("Gend", item);
                    string Gend = eJson.traverseNode();

                    eJson = new ExtractJNode("gendNC", item);
                    string GendNC = eJson.traverseNode();

                    eJson = new ExtractJNode("perceivedLgbt", item);
                    string perceivedLgbt = "N";
                    if (eJson.traverseNode() == "Yes")
                    {
                        perceivedLgbt = "Y";
                    }

                    eJson = new ExtractJNode("Is_Stud", item);
                    string Is_Stud = "";
                    if (isSchool == "Y")
                    {
                        if (eJson.traverseNode() == "True")
                            Is_Stud = "Y";
                        else
                            Is_Stud = "N";

                    }

                    eJson = new ExtractJNode("reasonForStop.key", item);
                    string StReas = eJson.traverseNode();

                    eJson = new ExtractJNode("reasonForStopExplanation", item);
                    string StReas_N = eJson.traverseNode();


                    eJson = new ExtractJNode("basisForSearch.key", item);
                    string BasSearch = eJson.traverseNode();
                    string[] BasSearchList = BasSearch.Split(',');

                    eJson = new ExtractJNode("basisForSearchBrief", item);
                    string BasSearch_N = eJson.traverseNode();

                    eJson = new ExtractJNode("basisForPropertySeizure.key", item);
                    string BasSeiz = eJson.traverseNode();
                    string[] BasSeizList = BasSeiz.Split(',');

                    eJson = new ExtractJNode("typeOfPropertySeized.key", item);
                    string PropType = eJson.traverseNode();
                    string[] PropTypeList = PropType.Split(',');

                    eJson = new ExtractJNode("contrabandOrEvidenceDiscovered.key", item);
                    string Cb = eJson.traverseNode();
                    string[] CbList = Cb.Split(',');
                    string pidStr = pid.ToString();


                    JArray listP = (JArray)stopdatarecord["Person_Stopped"];
                    listP.Add(new JObject(new JProperty("PID", pidStr),
                                          new JProperty("Perc",
                                            new JObject(new JProperty("ListEthn",
                                                            new JObject(new JProperty("Ethn", new JArray(ethnList)))),
                                                        new JProperty("Age", perceivedAge),
                                                        new JProperty("Is_LimEng", perceivedLimitedEnglish),
                                                        new JProperty("ListDisb",
                                                                new JObject(new JProperty("Disb", new JArray(prcvDisabltyList)))),
                                                        new JProperty("Gend", Gend),
                                                        new JProperty("GendNC", GendNC),
                                                        new JProperty("LGBT", perceivedLgbt))),
                                          new JProperty("Is_Stud", Is_Stud),
                                          new JProperty("PrimaryReason",
                                            new JObject(new JProperty("StReas", StReas),
                                                        new JProperty("StReas_N", StReas_N))),
                                          new JProperty("ListActTak",
                                            new JObject(new JProperty("ActTak", new JArray()))),
                                          new JProperty("ListBasSearch",
                                            new JObject( new JProperty("BasSearch", BasSearchList))),
                                          new JProperty("BasSearch_N", BasSearch_N),
                                          new JProperty("ListBasSeiz",
                                            new JObject(new JProperty("BasSeiz", BasSeizList))),
                                          new JProperty("ListPropType",
                                            new JObject(new JProperty("PropType", PropTypeList))),
                                          new JProperty("ListCB",
                                            new JObject(new JProperty("Cb", CbList))),
                                          new JProperty("ListResult",
                                            new JObject(new JProperty("Result", new JArray())))));



                    i = pid - 1;

                    //Action Taken
                    eJson = new ExtractJNode("actionsTakenDuringStop.key", item);
                    string ActTak = eJson.traverseNode();
                    string[] ActTakList = ActTak.Split(';');

                    JObject ListActTakO = (JObject)listP[i]["ListActTak"];
                    JArray listAct = (JArray)ListActTakO["ActTak"];
                    for (int j=0; j < ActTakList.Length; j++)
                    {
                        string[] CD_Con = ActTakList[j].Split(',');
                        if (CD_Con.Length == 2) 
                            listAct.Add(new JObject(new JProperty("Act_CD", CD_Con[0]),
                                                new JProperty("Is_Con", CD_Con[1])));
                        else
                            listAct.Add(new JObject(new JProperty("Act_CD", CD_Con[0]),
                                                new JProperty("Is_Con", "na")));
                    }

                    deJson = new ExtractJNode("reasonForStop.details.key", item);
                    JObject PrimaryReason = (JObject)listP[i]["PrimaryReason"];
                    string key = "";
                    string reasonCode = "";

                    // Traffic Violation
                    if (StReas == "1")
                    {
                        key = deJson.traverseNode();
                        PrimaryReason.Add(new JProperty("Tr_ID", key));
                    }

                    eJson = new ExtractJNode("reasonForStop.codes.code", item);
                    if (StReas == "1")
                    {
                        reasonCode = eJson.traverseNode();
                        PrimaryReason.Add(new JProperty("Tr_O_CD", reasonCode));
                    }

                    // Reasonable Suspicion
                    if (StReas == "2")
                    {
                        key = deJson.traverseNode();
                        string[] keys = key.Split(',');
                        PrimaryReason.Add(new JProperty("ListSusp_T",
                                            new JObject(new JProperty("Susp_T", keys))));
                    }

                    eJson = new ExtractJNode("reasonForStop.codes.code", item);
                    if (StReas == "2")
                    {
                        reasonCode = eJson.traverseNode();
                        string[] codes = reasonCode.Split(',');
                        PrimaryReason.Add(new JProperty("Susp_O_CD", codes));
                    }

                    // Education Code
                    if (StReas == "7")
                    {
                        key = deJson.traverseNode();
                        PrimaryReason.Add(new JProperty("EDU_sec_CD", key));
                    }

                    eJson = new ExtractJNode("reasonForStop.codes.code", item);
                    if (StReas == "7")
                    {
                        reasonCode = eJson.traverseNode();
                        PrimaryReason.Add(new JProperty("EDU_subDiv_CD", reasonCode));

                    }
                    JArray resultOfStopList = (JArray)item["resultOfStop"];

                    foreach (JObject resultItem in resultOfStopList)
                    {
                        JObject resultRecord = (JObject)listP[i]["ListResult"];
                        JArray listR = (JArray)resultRecord["Result"];

                        eJson = new ExtractJNode("key", resultItem);
                        string Result = eJson.traverseNode();
                        string[] ResultList = Result.Split(',');
                        foreach (string unit in ResultList)
                        {
                            eJson = new ExtractJNode("codes.code", resultItem);
                            string Res_O_CD = eJson.traverseNode();
                            string[] Res_O_CDList = Res_O_CD.Split(',');
                            listR.Add(new JObject(new JProperty("ResCD", unit),
                                                    new JProperty("Res_O_CD", Res_O_CDList)));
                        }                      

                    }
                    

                    jString = JsonConvert.SerializeObject(jsonObject);
                }


                string sJSON = JsonConvert.SerializeObject(jsonObject);
                return sJSON;
            }
            catch (Exception error)
            {
                string err = error.Message;
                throw error;
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
