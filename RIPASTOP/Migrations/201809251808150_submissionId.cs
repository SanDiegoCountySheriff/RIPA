namespace RIPASTOP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class submissionId : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Stops", "SubmissionsID", c => c.Int(nullable: true));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Stops", "SubmissionsID");
        }
    }
}
