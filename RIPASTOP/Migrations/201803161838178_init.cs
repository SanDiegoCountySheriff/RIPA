namespace RIPASTOP.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Stops",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Time = c.DateTime(nullable: false),
                        JsonStop = c.String(),
                        JsonDojStop = c.String(),
                        PersonCount = c.Int(nullable: false),
                        Latitude = c.String(maxLength: 55),
                        Longitude = c.String(maxLength: 55),
                        Beat = c.String(maxLength: 10),
                        JsonInstrumentation = c.String(),
                        Status = c.String(),
                        StatusMessage = c.String(),
                        UserProfileID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.UserProfiles", t => t.UserProfileID, cascadeDelete: true)
                .Index(t => t.UserProfileID);
            
            CreateTable(
                "dbo.UserProfile_Conf",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        NTUserName = c.String(),
                        UserProfileID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.UserProfiles", t => t.UserProfileID, cascadeDelete: true)
                .Index(t => t.UserProfileID);
            
            CreateTable(
                "dbo.UserProfiles",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Agency = c.String(maxLength: 2),
                        ORI = c.String(maxLength: 20),
                        Years = c.Int(nullable: false),
                        Assignment = c.String(maxLength: 255),
                        AssignmentOther = c.String(),
                        AssignmentKey = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserProfile_Conf", "UserProfileID", "dbo.UserProfiles");
            DropForeignKey("dbo.Stops", "UserProfileID", "dbo.UserProfiles");
            DropIndex("dbo.UserProfile_Conf", new[] { "UserProfileID" });
            DropIndex("dbo.Stops", new[] { "UserProfileID" });
            DropTable("dbo.UserProfiles");
            DropTable("dbo.UserProfile_Conf");
            DropTable("dbo.Stops");
        }
    }
}
