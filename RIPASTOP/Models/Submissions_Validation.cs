using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RIPASTOP.Models
{
    [MetadataType(typeof(Submissions_Validation))]
    public partial class Submissions
    {
        public Submissions()
        {
            statusMsgs = new HashSet<StatusMessage_JSON_vw>();
        }

        public virtual ICollection<StatusMessage_JSON_vw> statusMsgs { get; set; } //access StatusMessage_JSON_vw entity 
        public virtual ICollection<Submissions> subList { get; set; }

    }
    [Bind(Exclude = "ID")]
    public class Submissions_Validation
    {
        [Required]
        public DateTime? EndDate { get; set; }
    }
}