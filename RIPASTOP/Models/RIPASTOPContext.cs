using System.Data.Entity;

namespace RIPASTOP.Models
{
    public class RIPASTOPContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx

        public RIPASTOPContext() : base("name=RIPASTOPContext")
        {
        }

        public System.Data.Entity.DbSet<RIPASTOP.Models.UserProfile> UserProfiles { get; set; }
        public System.Data.Entity.DbSet<RIPASTOP.Models.UserProfile_Conf> UserProfile_Conf { get; set; }
        public System.Data.Entity.DbSet<RIPASTOP.Models.Stop> Stop { get; set; }
        //public System.Data.Entity.DbSet<RIPASTOP.Models.StopOfficerIDDateTime_JSON_vw> StopOfficerIDDateTime_JSON_vw { get; set; }
    }
}
