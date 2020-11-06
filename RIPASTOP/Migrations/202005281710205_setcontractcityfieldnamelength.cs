namespace RIPASTOP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class setcontractcityfieldnamelength : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.UserProfiles", "ContractCity", c => c.String(maxLength: 50));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.UserProfiles", "ContractCity", c => c.String());
        }
    }
}
