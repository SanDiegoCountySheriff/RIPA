﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace RIPASTOP.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class Entities : DbContext
    {
        public Entities()
            : base("name=Entities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<CJISOffenseCodes> CJISOffenseCodes { get; set; }
        public virtual DbSet<schools> schools { get; set; }
        public virtual DbSet<Cities> Cities { get; set; }
        public virtual DbSet<Beats> Beats { get; set; }
        public virtual DbSet<StopOfficerIDDateTime_JSON_vw> StopOfficerIDDateTime_JSON_vw { get; set; }
    }
}
