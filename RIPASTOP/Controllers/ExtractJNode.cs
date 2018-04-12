using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;


namespace RIPASTOP.Controllers
{
    class ExtractJNode
    {
        private string[] nPath;
        private JObject o;
        public string name { get; set; }
        //public struct NodePairs
        //{
        //    public string name;
        //    public string value;
        //}
        //NodePairs nPair;

        public ExtractJNode(string JsonPath, JObject obj)
        {
            nPath = JsonPath.Split('.');
            o = obj;
        }

        private IEnumerable<JToken> TraversTree(JToken nodeList)
        {
            JToken Nodes = (JToken)nodeList;
            Type objType;

            if (Nodes.Count() == 0)
                yield return Nodes;
            else
            {
                foreach (var item in Nodes)
                {
                    objType = item.GetType();
                    if (objType.Name == "JProperty")
                    {
                        JProperty content = (JProperty)item;
                        //foreach (JProperty prop in content.Properties())
                        //{
                        name = content.Name;
                        //}
                    }

                    foreach (var subItem in TraversTree(item))
                    {
                        yield return subItem;
                    }

                }

            }
        }

        public string traverseNode()
        {
            string NodeString = "";
            JToken obj;
            Type objType;
            bool traversed = false;
            try
            {
                int nodeLength = nPath.Length;

                string jString = JsonConvert.SerializeObject(o);

                obj = o[nPath[0]];
                for (int i = 0; i < nodeLength - 1; i++)
                {
                    if (i != 0)
                        obj = obj[nPath[i]];

                    objType = obj.GetType();
                    if (objType.Name == "JArray")
                    {
                        var Nodes =
                            from n in obj
                            select n[nPath[i + 1]];

                        foreach (JToken item in Nodes)
                        {
                            foreach (var value in TraversTree(item))
                            {
                                if (name == nPath[nodeLength - 1])
                                {
                                    NodeString += value.ToString() + ',';
                                    traversed = true;
                                }
                            }
                            if (!traversed)
                            {
                                if (nPath[0] == "actionsTakenDuringStop")
                                    NodeString += item.ToString() + ';';
                                else
                                    NodeString += item.ToString() + ',';
                            }
                        }
                        if (traversed)
                            i = nodeLength;
                    }
                }
                if (obj != null)
                {
                    objType = obj.GetType();
                    if (objType.Name != "JArray")
                    {
                        if (nodeLength == 1)
                            NodeString = (string)o[nPath[0]];
                        else
                            NodeString = (string)obj[nPath[nodeLength - 1]];
                    }
                }
                else
                {
                    NodeString = "";
                }

                if (nPath[0] == "actionsTakenDuringStop")
                    NodeString = NodeString.TrimEnd(';');
                else
                    NodeString = NodeString.TrimEnd(',');

            }
            catch (Exception error)
            {
                string err = error.Message;
                throw error;
            }

            return NodeString;
        }

    }
}