using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RIPASTOP.Models
{
    [MetadataType(typeof(Cities_Validation))]
    public partial class Cities
    {
        public Cities()
        {
        }
    }
    public class Cities_Validation
    {
        [StringLength(50)]
        [Key]
        public string City { get; set; }
    }
}