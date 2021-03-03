namespace RIPASTOP.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class foreignKey : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Stops", "SubmissionsID", c => c.Int());
        }

        public override void Down()
        {
            AlterColumn("dbo.Stops", "SubmissionsID", c => c.Int(nullable: false));
        }
    }
}
