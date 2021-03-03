namespace RIPASTOP.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class newfieldforcontractcities : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.UserProfiles", "ContractFundedPosition", c => c.Boolean());
            AddColumn("dbo.UserProfiles", "ContractCity", c => c.String());
        }

        public override void Down()
        {
            DropColumn("dbo.UserProfiles", "ContractCity");
            DropColumn("dbo.UserProfiles", "ContractFundedPosition");
        }
    }
}
