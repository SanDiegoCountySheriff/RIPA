using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace RIPASTOP.Models
{
    public partial class UserProfile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public Guid ID { get; set; }
        public int ID { get; set; }
        [StringLength(2)]
        public string Agency { get; set; }
        [StringLength(20)]
        public string ORI { get; set; }
        [Range(1, 50)]
        public int Years { get; set; }
        [StringLength(255)]
        public string Assignment { get; set; }
        //       [StringLength(255, MinimumLength = 3)]
        public string AssignmentOther { get; set; }
        public int AssignmentKey { get; set; }
        public bool? ContractFundedPosition { get; set; }
        [StringLength(50)]
        public string ContractCity { get; set; }
        public bool? ContractFundedEvent { get; set; }
        [StringLength(50)]
        public string ContractEvent { get; set; }
        public List<Stop> Stops { get; set; }
    }

    public class UserProfile_Conf
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public Guid ID { get; set; }
        public int ID { get; set; }
        //[StringLength(200)]
        public string NTUserName { get; set; }
        public virtual UserProfile UserProfile { get; set; }
        //public string CountyID { get; set; }

        [ForeignKey("UserProfile")]
        //public Guid UserProfileID { get; set; }
        public int UserProfileID { get; set; }
    }


    public class Stop
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public Guid ID { get; set; }
        public int ID { get; set; }
        public DateTime Time { get; set; }
        public string JsonStop { get; set; }
        public string JsonDojStop { get; set; }
        public int PersonCount { get; set; }
        [StringLength(55)]
        public string Latitude { get; set; }
        [StringLength(55)]
        public string Longitude { get; set; }
        [StringLength(10)]
        public string Beat { get; set; }
        public string JsonInstrumentation { get; set; }
        public string Status { get; set; }
        public string StatusMessage { get; set; }
        //public Guid UserProfileID { get; set; } //fk
        public int UserProfileID { get; set; } //fk
        public int? SubmissionsID { get; set; } //fk
        public string JsonSubmissions { get; set; }
    }

}