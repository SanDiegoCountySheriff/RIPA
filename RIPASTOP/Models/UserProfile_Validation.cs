using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace RIPASTOP.Models
{
    [MetadataType(typeof(UserProfile_Validation))]
    public partial class UserProfile
    {
        public UserProfile()
        {
        }

    }
    public class UserProfile_Validation
    {
        [StringLength(60, MinimumLength = 3)]
        [MaxLength]
        public string AssignmentOther { get; set; }
    }
}