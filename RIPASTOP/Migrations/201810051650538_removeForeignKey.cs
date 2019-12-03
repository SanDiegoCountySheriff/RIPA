namespace RIPASTOP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class removeForeignKey : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Stops", "JsonSubmissions", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Stops", "JsonSubmissions");
        }
    }
}
