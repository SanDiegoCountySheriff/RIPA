namespace RIPASTOP.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class newContractEventCols : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.UserProfiles", "ContractFundedEvent", c => c.Boolean());
            AddColumn("dbo.UserProfiles", "ContractEvent", c => c.String(maxLength: 50));
        }

        public override void Down()
        {
            DropColumn("dbo.UserProfiles", "ContractEvent");
            DropColumn("dbo.UserProfiles", "ContractFundedEvent");
        }
    }
}
