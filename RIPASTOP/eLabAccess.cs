using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Linq;
using System.Web;


namespace SDSD.SDLaw.eLab
{
    public class eLabLib
    {
    }

    //********************************* CLASS *****************************
    /// <summary>SQL Server Data Accessor class</summary>
    public class SQLDBDataAccessorClass
    {
        //============================= PROPERTY ================================
        //protected string csConnString = "data source=tcp:vexwebtest101;Initial Catalog=eLab;integrated security=SSPI;persist security info=True; packet size=4096;";
        protected string csConnString = Properties.Settings.Default.strConn.ToString();

        SqlConnection conn = new SqlConnection();
        SqlDataAdapter adapter = new SqlDataAdapter();
        SqlCommand Command = new SqlCommand();
        DataSet ds = new DataSet();

        //----------------------------- METHOD ----------------------------
        public SQLDBDataAccessorClass()
        {
            conn.ConnectionString = csConnString;
        }

        //----------------------------- METHOD ----------------------------
        public DataSet mds_ExecuteQuery(string psCmdText, string psTableName)
        {
            try
            {
                conn.Open();
                adapter.SelectCommand = new SqlCommand(psCmdText, conn);
                adapter.Fill(ds, psTableName);
                conn.Close();
                conn.Dispose();
                return ds;
            }
            
            catch (Exception ex)
            {
                //return exception error handling
                string strErr = ex.Message.ToString().Trim();
                conn.Close();
                conn.Dispose();
                return ds;
            }
        }

        //----------------------------- METHOD ----------------------------
        public void mv_InsertOrUpdate(string psIn)
        {
            conn.Open();
            Command.Connection = conn;
            Command.CommandText = psIn;
            Command.ExecuteNonQuery();
            conn.Close();
            conn.Dispose();
        }

        public void mv_OpenConnection()
        {
            Command.Connection = conn;
            conn.Open();
        }

        //----------------------------- METHOD ----------------------------
        public void mv_CloseConnection()
        {
            Command.Connection.Close();
        }
   }

}
