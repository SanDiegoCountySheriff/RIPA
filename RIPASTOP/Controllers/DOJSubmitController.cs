using System;
using System.IO;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using RIPASTOP.Models;
using System.Text;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Web.Http.ModelBinding;
using System.Configuration;
using System.Web.Hosting;

namespace RIPASTOP.Controllers
{
    public class DOJSubmitController : ApiController
    {
        private string DOJWebApiUrl;
        private string LogFilePath1;
        private string LogFilePath2;
        //private const string TestDOJUrl = "https://sdcsstg.ext.doj.ca.gov/stopdata-1.0/webapi/stopdataservice/readrecord";
        private const string connectionTestData = "{\"LEARecordID\":\"\",\"BatchID\":\"\",\"ORI\":\"\",\"TX_Type\":\"\",\"Is_NFIA\":\"\",\"SDate\":\"\",\"STime\":\"\",\"SDur\":\"\",\"Officer\":{\"UID\":\"\",\"Proxy\":\"\",\"ExpYears\":\"\",\"AT\":\"\",\"ATOth\":\"\"},\"Location\":{\"Loc\":\"\",\"City\":\"\",\"K12_Flag\":\"\",\"K12Code\":\"\"},\"Is_ServCall\":\"\",\"ListPerson_Stopped\":{\"Person_Stopped\":[{\"PID\":\"\",\"Perc\":{\"ListEthn\":{\"Ethn\":[\"\"]},\"Age\":\"\",\"Is_LimEng\":\"\",\"ListDisb\":{\"Disb\":[\"\"]},\"Gend\":\"\",\"GendNC\":\"\",\"LGBT\":\"\"},\"Is_Stud\":\"\",\"PrimaryReason\":{\"StReas\":\"\",\"StReas_N\":\"\",\"Tr_ID\":\"\",\"Tr_O_CD\":\"\"},\"ListActTak\":{\"ActTak\":[{\"Act_CD\":\"\",\"Is_Con\":\"\"}]},\"ListBasSearch\":{\"BasSearch\":[\"\"]},\"BasSearch_N\":\"\",\"ListBasSeiz\":{\"BasSeiz\":[\"\"]},\"ListPropType\":{\"PropType\":[\"\"]},\"ListCB\":{\"Cb\":[\"\"]},\"ListResult\":{\"Result\":[{\"ResCD\":\"\",\"Res_O_CD\":[\"\"]}]}}]}}";
        private RIPASTOPContext db = new RIPASTOPContext();
        private Entities entitiesdb = new Entities();
        //public string path = AppDomain.CurrentDomain.BaseDirectory + @"Log\";
        //public string path = HostingEnvironment.MapPath("~/") + @"Log\";
        public string logFile1;
        public string logFile2 = "";

        public class JsonResultModel
        {
            public string ErrorMessage { get; set; }
            public bool IsSuccess { get; set; }
            public string Results { get; set; }
            public string Log { get; set; }
            public int processedCount = 0;
            public int succeededCount = 0;
            public int failedCount = 0;
            public int fatalCount = 0;
            public int httpErrCount = 0;
        }
        public class aggregate
        {
            public int submissionID = 0;
            public int processedCount = 0;
            public int succeededCount = 0;
            public int failedCount = 0;
            public int fatalCount = 0;
            public int httpErrCount = 0;
        }

        public class DojResultModel
        {
            public string VFlag { get; set; }
            public string Status { get; set; }
            public string ReturnPayload { get; set; }

            private string[] messages;

            public string[] GetMessages()
            {
                return messages;
            }

            public void SetMessages(string[] value)
            {
                messages = value;
            }
        }
        public class connectionStatus
        {
            public bool connected { get; set; }
            public string error { get; set; }
        }

        //public connectionStatus HTTP_Connection()
        //{
        //    connectionStatus connectStat = new connectionStatus();
        //    connectStat.error = String.Empty;
        //    System.Net.WebRequest req = System.Net.WebRequest.Create(TestDOJUrl);
        //    try
        //    {
        //        connectStat.connected = false;

        //        var response = (HttpWebResponse)req.GetResponse();
        //        if (response.StatusCode == HttpStatusCode.OK)
        //        {
        //            //  it is responsive
        //            connectStat.error = string.Format("{0} Available", TestDOJUrl);
        //            connectStat.connected = true;
        //        }
        //        else
        //        {
        //            connectStat.error = string.Format("{0} Returned, but with status: {1}",
        //                TestDOJUrl, response.StatusDescription);
        //        }
        //        return connectStat;
        //    }
        //    catch (Exception ex)
        //    {
        //        //  not available at all, for some reason
        //        connectStat.error = string.Format("{0} unavailable: {1}", TestDOJUrl, ex.Message);
        //        connectStat.connected = false;
        //        return connectStat;
        //    }
        //}

        public connectionStatus HTTP_Connection()
        {
            try
            {
                string Out = String.Empty;
                string Error = String.Empty;
                string Log = String.Empty;
                ExtractJNode eJson;

                connectionStatus connectStat = new connectionStatus();
                connectStat.error = String.Empty;
                connectStat.connected = true;
                DOJWebApiUrl = ConfigurationManager.AppSettings["DOJWebApiUrl"];

                System.Net.WebRequest req = System.Net.WebRequest.Create(DOJWebApiUrl);

                req.Method = "PUT";
                req.Timeout = 100000;
                req.ContentType = "application/json";

                byte[] sentData = Encoding.UTF8.GetBytes(connectionTestData);
                req.ContentLength = sentData.Length;

                using (Stream sendStream = req.GetRequestStream())
                {
                    sendStream.Write(sentData, 0, sentData.Length);
                    sendStream.Close();
                }

                System.Net.WebResponse res = req.GetResponse();
                Stream ReceiveStream = res.GetResponseStream();
                using (StreamReader sr = new
                StreamReader(ReceiveStream, Encoding.UTF8))
                {

                    Char[] read = new Char[256];
                    int count = sr.Read(read, 0, 256);

                    while (count > 0)
                    {
                        String str = new String(read, 0, count);
                        Out += str;
                        count = sr.Read(read, 0, 256);
                    }
                }
                JObject o = JObject.Parse(Out);
                eJson = new ExtractJNode("Messages.Code", o);
                string code = eJson.traverseNode();
                if (code == "SYSERR")
                {
                    eJson = new ExtractJNode("Messages.Message", o);
                    string message = eJson.traverseNode();
                    connectStat.error = code + " : " + message;
                    connectStat.connected = false;
                }
                return connectStat;
            }
            catch (Exception error)
            {
                string err = error.Message;
                throw error;
            }
        }

        // Check the connection to DOJ restful web api
        public Boolean HTTP_Connection2()
        {
            string DOJUrlConnectTest = ConfigurationManager.AppSettings["DOJUrlConnectTest"];

            WebRequest req = System.Net.WebRequest.Create(DOJUrlConnectTest);
            req.Method = "GET";

            using (var response = (HttpWebResponse)req.GetResponse())
            {
                var responseValue = string.Empty;

                if (response.StatusCode != HttpStatusCode.OK)
                {
                    var message = String.Format("Request failed. Received HTTP {0}", response.StatusCode);
                    throw new ApplicationException(message);
                }

                // grab the response
                using (var responseStream = response.GetResponseStream())
                {
                    if (responseStream != null)
                        using (var reader = new StreamReader(responseStream))
                        {
                            responseValue = reader.ReadToEnd();
                        }
                }
                if (responseValue == "Hello Jersey")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }


        }

        private void HTTP_PUT(string Url, string Data, JsonResultModel model)
        {
            string Out = String.Empty;
            string Error = String.Empty;
            String Log = String.Empty;

            WebRequest req = System.Net.WebRequest.Create(Url);

            try
            {
                req.Method = "PUT";
                req.Timeout = 100000;
                req.ContentType = "application/json";

                byte[] sentData = Encoding.UTF8.GetBytes(Data);
                req.ContentLength = sentData.Length;

                Log = DateTime.Now + " :: Sent Request :: " + Data + Environment.NewLine;

                using (Stream sendStream = req.GetRequestStream())
                {
                    sendStream.Write(sentData, 0, sentData.Length);
                    sendStream.Close();

                }

                System.Net.WebResponse res = req.GetResponse();
                Stream ReceiveStream = res.GetResponseStream();
                using (StreamReader sr = new
                StreamReader(ReceiveStream, Encoding.UTF8))
                {

                    Char[] read = new Char[256];
                    int count = sr.Read(read, 0, 256);

                    while (count > 0)
                    {
                        String str = new String(read, 0, count);
                        Out += str;
                        count = sr.Read(read, 0, 256);
                    }
                }
                Log += DateTime.Now + " :: Received Request :: " + Out + Environment.NewLine;
                model.Results = Out;
                model.ErrorMessage = Error;
                Log += DateTime.Now + " :: ERRORS :: " + model.ErrorMessage + Environment.NewLine;
                model.Log = Log;

                File.AppendAllText(logFile1, model.Log);

                if (!string.IsNullOrWhiteSpace(Out))
                {
                    model.IsSuccess = true;
                }
                else
                {
                    model.IsSuccess = false;
                }
            }
            catch (ArgumentException ex)
            {
                Error = string.Format("ArgumentException raiesed trying to stream data to DOJ :: {0}", ex.Message);
                model.httpErrCount++;
                throw ex;
            }
            catch (WebException ex)
            {
                Error = string.Format("WebException raised! :: {0}", ex.Message);
                model.httpErrCount++;
                throw ex;
            }
            catch (Exception ex)
            {
                Error = string.Format("Exception raised! :: {0}", ex.Message);
                model.httpErrCount++;
                throw ex;
            }
        }

        // GET: api/DOJSubmit
        public async Task<EntityState> GetStops(Submissions submission)
        {
            JsonResultModel jsonResult = new JsonResultModel();

            DojResultModel dojRes = new DojResultModel();
            ExtractJNode eJson;
            string logFilename;
            DOJWebApiUrl = ConfigurationManager.AppSettings["DOJWebApiUrl"];


            try
            {
                entitiesdb.Submissions.Add(submission);
                entitiesdb.SaveChanges();
                int submissionID = submission.ID;
                logFilename = submissionID + "-" + DateTime.Now.ToString("yyyyMMdd_HHmmss") + ".txt";
                submission.LogFile = logFilename;

                // Writing logs on both servers
                LogFilePath1 = ConfigurationManager.AppSettings["LogFilePath1"];
                LogFilePath2 = ConfigurationManager.AppSettings["LogFilePath2"];
                if (LogFilePath2 == "")
                {
                    logFile1 = LogFilePath1 + logFilename;
                }
                else
                {
                    logFile1 = LogFilePath1 + logFilename;
                    logFile2 = LogFilePath2 + logFilename;
                }

                if (!File.Exists(logFile1))
                {
                    // Create log file to write to.
                    File.WriteAllText(logFile1,"");
                }

                if (!Directory.Exists(LogFilePath1))
                {
                    Directory.CreateDirectory(LogFilePath1);
                }
                if (LogFilePath2 != "")
                {
                    if (!Directory.Exists(LogFilePath2))
                    {
                        Directory.CreateDirectory(LogFilePath2);
                    }
                }

                var stopsIDs = entitiesdb.StopOfficerIDDateTime_JSON_vw.ToList()
                                        .Where(x => submission.StartDate <= Convert.ToDateTime(x.stopDate) && Convert.ToDateTime(x.stopDate) <= submission.EndDate)
                                        //.Where(x => submission.StartDate <= Convert.ToDateTime(x.stopDate) && Convert.ToDateTime(x.stopDate) <= submission.EndDate && x.ID >= 15187  )
                                        .Select(x => x.ID);

                string DOJjson = "";
                foreach (int stopId in stopsIDs)
                {
                    Stop st = db.Stop
                        .Where(x => x.ID == stopId && x.Status != "success" && x.Status != "postSubRedact")
                        .Select(x => x).FirstOrDefault();

                    JObject submissionO;
                    JArray subInfoArry;
                    bool edited = false;


                    if (st != null)
                    {

                        // If JsonSubmissions is not null, check the last SubmissionInfo to see if this Stop has been edited
                        if (st.JsonSubmissions != null)
                        {
                            submissionO = JObject.Parse(st.JsonSubmissions);
                            JObject lastSubmission = (JObject)submissionO["SubmissionInfo"].Last();
                            edited = (bool)lastSubmission["edited"];
                        }
                        if (st.JsonSubmissions == null || edited)
                        {
                            jsonResult.processedCount++;
                            submission.TotalProcessed = jsonResult.processedCount;
                            DOJjson = st.JsonDojStop;
                            HTTP_PUT(Url: DOJWebApiUrl, Data: DOJjson, model: jsonResult);
                            // the next lines are for testing
                            //jsonResult.Results = "{    \"MandatoryValidationFlag\": false,    \"Status\": \"failed\",    \"BatchID\": \"\",    \"LEARecordID\": \"63\",    \"ORI\": \"CA0370000\",    \"OfficerUID\": \"11\",    \"Proxy\": \"\",    \"StopDate\": \"06 / 05 / 2018\",    \"StopTime\": \"14:25:51\",    \"Messages\": [      {        \"Code\": \"DV007\",        \"Field\": \"UID\",        \"Message\": \"Officer Unique ID is invalid or missing, it must be 9 alphanumerical characters.\",        \"PersonNumber\": null      }    ]}";
                            //jsonResult.Results = "{\"MandatoryValidationFlag\":false,\"Status\":\"failed\",\"BatchID\":\"\",\"LEARecordID\":\"14140\",\"ORI\":\"CA0370000\",\"OfficerUID\":\"111106405\",\"Proxy\":\"\",\"StopDate\":\"06 / 05 / 2018\",\"StopTime\":\"23:58:56\",\"Messages\":[{\"Code\":\"DV236\",\"Field\":\"Tx_type\",\"Message\":\"Duplicate record exists with the same ORI,  LEA record ID combination.\",\"PersonNumber\":null},{\"Code\":\"DV004\",\"Field\":\"sTime\",\"Message\":\"Duplicate record; a stop exists for this ORI, Officer UID, Date & Time.\",\"PersonNumber\":null}]}";
                            //jsonResult.IsSuccess = true;
                            if (jsonResult.IsSuccess)
                            {
                                dojRes.ReturnPayload = jsonResult.Results;

                                st.SubmissionsID = submissionID;
                                if (st.JsonSubmissions == null)
                                {
                                    submissionO = JObject.FromObject(new { SubmissionInfo = new JArray() });
                                }
                                else
                                {
                                    submissionO = JObject.Parse(st.JsonSubmissions);
                                }
                                subInfoArry = (JArray)submissionO["SubmissionInfo"];
                                subInfoArry.Add(new JObject(new JProperty("submissionID", submissionID), new JProperty("edited", false)));
                                st.JsonSubmissions = JsonConvert.SerializeObject(submissionO);

                                JObject o = JObject.Parse(dojRes.ReturnPayload);
                                o.Add("CustomProperty_DOJReceiptTime", DateTime.Now.ToString());
                                eJson = new ExtractJNode("MandatoryValidationFlag", o);
                                dojRes.VFlag = eJson.traverseNode();

                                eJson = new ExtractJNode("Status", o);
                                dojRes.Status = eJson.traverseNode();

                                if (dojRes.VFlag == "True")
                                {
                                    if (dojRes.Status == "failed")
                                    {
                                        st.Status = "fail";
                                        jsonResult.failedCount++;
                                        submission.TotalWithErrors = jsonResult.failedCount;
                                    }
                                    else
                                    {
                                        st.Status = "success";
                                        jsonResult.succeededCount++;
                                        submission.TotalSuccess = jsonResult.succeededCount;
                                    }
                                }
                                else
                                {
                                    if (dojRes.Status == "failed")
                                    {
                                        st.Status = "fatal";
                                        jsonResult.fatalCount++;
                                        submission.TotalRejected = jsonResult.fatalCount;
                                    }
                                }

                                st.StatusMessage = o.ToString();

                                // The following section of code, saving messages in dojRes is not used at this point
                                if (st.Status != "success")
                                {
                                    eJson = new ExtractJNode("Messages.Message", o);
                                    string messages = eJson.traverseNode();
                                    messages = messages.Replace(".,", "~");
                                    dojRes.SetMessages(messages.Split('~'));
                                }

                            }
                            else
                            {
                                submission.TotalHTTPErrors = jsonResult.httpErrCount;
                            }
                            await db.SaveChangesAsync();
                            entitiesdb.Entry(submission).State = EntityState.Modified;
                            await entitiesdb.SaveChangesAsync();

                        }
                    }

                }
                jsonResult.Log += "Records processed = " + jsonResult.processedCount + Environment.NewLine +
                                                        "Records successfully submitted = " + jsonResult.succeededCount + Environment.NewLine +
                                                        "Records with errors = " + jsonResult.failedCount + Environment.NewLine +
                                                        "Rejected records = " + jsonResult.fatalCount + Environment.NewLine +
                                                        "HTTP error count = " + jsonResult.httpErrCount + Environment.NewLine;

                File.AppendAllText(logFile1, jsonResult.Log);
                if (LogFilePath2 != "")
                {
                    File.Copy(logFile1, logFile2, true);
                }
                submission.LogFile = logFilename;
                var state = entitiesdb.Entry(submission).State;
                return state;
            }
            catch (Exception error)
            {
                string err = error.Message;
                jsonResult.Log += err + Environment.NewLine;
                jsonResult.Log += "Records processed = " + jsonResult.processedCount + Environment.NewLine +
                                                        "Records successfully submitted = " + jsonResult.succeededCount + Environment.NewLine +
                                                        "Records with errors = " + jsonResult.failedCount + Environment.NewLine +
                                                        "Rejected records = " + jsonResult.fatalCount + Environment.NewLine +
                                                        "HTTP error count = " + jsonResult.httpErrCount + Environment.NewLine;
                File.AppendAllText(logFile1, jsonResult.Log);
                throw error;
            }

            //return Ok(db.Stop.Where(x => startDate <= x.Time && x.Time <= endDate && (x.Status == "fail" || x.Status == "fatal")).ToList());
        }

        // GET: api/DOJSubmit
        public aggregate GetAggregate(int ID)
        {
            aggregate allAggregates = new aggregate();
            if (ID == 0)
            {
                Submissions submittedRec = entitiesdb.Submissions
                                .Where(x => x.Status == "In Progress")
                                .OrderByDescending(x => x.ID)
                                .Select(x => x).FirstOrDefault();
                if (submittedRec != null)
                {
                    allAggregates.submissionID = submittedRec.ID;
                    ID = submittedRec.ID;
                }
            }


            if (ID != 0)
            {
                Submissions submission = entitiesdb.Submissions.Find(ID);
                allAggregates.submissionID = ID;
                allAggregates.processedCount = Convert.ToInt32(submission.TotalProcessed);
                allAggregates.succeededCount = Convert.ToInt32(submission.TotalSuccess);
                allAggregates.fatalCount = Convert.ToInt32(submission.TotalRejected);
                allAggregates.failedCount = Convert.ToInt32(submission.TotalWithErrors);
                allAggregates.httpErrCount = Convert.ToInt32(submission.TotalHTTPErrors);
            }

            return allAggregates;
        }

        //// POST: api/DOJSubmit
        //[HttpPost]
        //public int POSTTotalStopsToSubmit(DateTime startDate, DateTime endDate)
        //{
        //    //int stopsCount = entitiesdb.StopOfficerIDDateTime_JSON_vw.ToList()
        //    //    .Where(x => startDate <= Convert.ToDateTime(x.stopDate) && Convert.ToDateTime(x.stopDate) <= endDate).Count();
        //    int stopsCount = entitiesdb.StopOfficerIDDateTime_JSON_vw.ToList()
        //                    .Join(db.Stop,
        //                    j => j.ID,
        //                    s => s.ID,
        //                    (j,s) => new { StopOfficerIDDateTime_JSON_vw = j, Stop = s })
        //                    .Where(x => startDate <= Convert.ToDateTime(x.StopOfficerIDDateTime_JSON_vw.stopDate) && Convert.ToDateTime(x.StopOfficerIDDateTime_JSON_vw.stopDate) <= endDate && x.Stop.Status != "success" && x.Stop.Status != "postSubRedact").Count();
        //    //return string.Format("<h4>You are about to submit {0} stops.</h4>", stopsCount);
        //    return stopsCount;
        //}
    }
}
