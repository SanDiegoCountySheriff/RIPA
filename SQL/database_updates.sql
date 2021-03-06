ALTER TABLE UserProfile_Conf
ALTER COLUMN NTUserName nvarchar(200) not null

ALTER TABLE StopChangeAudits
ALTER COLUMN NTUserName nvarchar(200) not null

ALTER TABLE Stops
ALTER COLUMN Status nvarchar(20) null

ALTER TABLE Submissions
ALTER COLUMN Status nvarchar(20) null

ALTER TABLE Submissions
ALTER COLUMN LogFile nvarchar(55) null

ALTER TABLE UserProfile_Conf   
ADD CONSTRAINT AK_NTUserName UNIQUE (NTUserName);

SET ANSI_PADDING ON
GO

/****** Object:  Index [IX_Stops_Submissions]    Script Date: 11/17/2020 2:11:39 PM ******/
CREATE NONCLUSTERED INDEX [IX_Stops_Submissions] ON [dbo].[Stops]
(
	[Status] ASC,
	[SubmissionsID] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Beats](
	[Beat] [varchar](3) NOT NULL,
	[Community] [varchar](128) NOT NULL,
	[Command] [varchar](128) NOT NULL,
 CONSTRAINT [pk_Beats] PRIMARY KEY CLUSTERED 
(
	[Beat] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]


DROP TABLE [dbo].[Cities]

CREATE TABLE [dbo].[Cities](
	[State] [varchar](2) NULL,
	[City] [varchar](50) NOT NULL,
	[County] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[City] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[StopOfficerIDDateTime_JSON_vw]
AS
SELECT        JSON_VALUE(JsonStop, '$.officerID') AS officerID, JSON_VALUE(JsonStop, '$.date') AS stopDate, JSON_VALUE(JsonStop, '$.time') AS StopTime, ID
FROM            dbo.Stops
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "Stops"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 495
               Right = 341
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 1380
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'StopOfficerIDDateTime_JSON_vw'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'StopOfficerIDDateTime_JSON_vw'
GO

CREATE TABLE [dbo].[StopChangeAudits](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[OrigJsonStop] [nvarchar](max) NOT NULL,
	[ModJsonStop] [nvarchar](max) NOT NULL,
	[Reason] [nvarchar](max) NOT NULL,
	[NTUserName] [nvarchar](max) NOT NULL,
	[Time] [datetime] NOT NULL,
	[StopID] [int] NOT NULL,
 CONSTRAINT [PK_StopChangeAudits] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[Submissions](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[StartDate] [datetime] NOT NULL,
	[EndDate] [datetime] NULL,
	[Status] [nvarchar](max) NULL,
	[LogFile] [nvarchar](max) NULL,
	[TotalProcessed] [int] NULL,
	[TotalSuccess] [int] NULL,
	[TotalRejected] [int] NULL,
	[TotalWithErrors] [int] NULL,
	[TotalHTTPErrors] [int] NULL,
	[DateSubmitted] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Stops]  
	ADD SubmissionsID integer Null,
		JsonSubmissions nvarchar(max) Null
GO

ALTER TABLE [dbo].[Stops]  WITH CHECK ADD FOREIGN KEY([SubmissionsID])
REFERENCES [dbo].[Submissions] ([ID])
GO

DROP VIEW [dbo].[StatusMessage_JSON_vw]
GO

CREATE VIEW [dbo].[StatusMessage_JSON_vw]
AS
SELECT        row_number() OVER (ORDER BY Stops.ID) AS nid, Stops.ID AS StopID, Stops.Status AS StopStatus, msgs.*, Stops.SubmissionsID as submissionID, submissionStatus.edited
FROM            dbo.Stops OUTER APPLY OPENJSON(StatusMessage, '$.Messages') WITH (code nvarchar(max) '$.Code', msg nvarchar(max) '$.Message') AS msgs OUTER APPLY OPENJSON(JsonSubmissions, '$.SubmissionInfo') 
                         WITH (edited bit '$.edited') AS submissionStatus  
                         
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 9
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'StatusMessage_JSON_vw'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'StatusMessage_JSON_vw'
GO

/***** Update UserProfiles to add new columns *****/
/* To prevent any potential data loss issues, you should review this script in detail before running it outside the context of the database designer.*/
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
CREATE TABLE dbo.Tmp_UserProfiles
	(
	ID int NOT NULL IDENTITY (111101000, 1),
	Agency nvarchar(2) NULL,
	ORI nvarchar(20) NULL,
	Years int NOT NULL,
	Assignment nvarchar(255) NULL,
	AssignmentOther nvarchar(MAX) NULL,
	AssignmentKey int NOT NULL,
	ContractFundedPosition bit NULL,
	ContractCity nvarchar(50) NULL,
	ContractFundedEvent bit NULL,
	ContractEvent nvarchar(50) NULL
	)  ON [PRIMARY]
	 TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE dbo.Tmp_UserProfiles SET (LOCK_ESCALATION = TABLE)
GO
SET IDENTITY_INSERT dbo.Tmp_UserProfiles ON
GO
IF EXISTS(SELECT * FROM dbo.UserProfiles)
	 EXEC('INSERT INTO dbo.Tmp_UserProfiles (ID, Agency, ORI, Years, Assignment, AssignmentOther, AssignmentKey)
		SELECT ID, Agency, ORI, Years, Assignment, AssignmentOther, AssignmentKey FROM dbo.UserProfiles WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_UserProfiles OFF
GO
ALTER TABLE dbo.UserProfile_Conf
	DROP CONSTRAINT [FK_dbo.UserProfile_Conf_dbo.UserProfiles_UserProfileID]
GO
ALTER TABLE dbo.Stops
	DROP CONSTRAINT FK_Stops_UserProfiles
GO
DROP TABLE dbo.UserProfiles
GO
EXECUTE sp_rename N'dbo.Tmp_UserProfiles', N'UserProfiles', 'OBJECT' 
GO
ALTER TABLE dbo.UserProfiles ADD CONSTRAINT
	[PK_dbo.UserProfiles] PRIMARY KEY CLUSTERED 
	(
	ID
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.Stops ADD CONSTRAINT
	FK_Stops_UserProfiles FOREIGN KEY
	(
	UserProfileID
	) REFERENCES dbo.UserProfiles
	(
	ID
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.Stops SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.UserProfile_Conf ADD CONSTRAINT
	[FK_dbo.UserProfile_Conf_dbo.UserProfiles_UserProfileID] FOREIGN KEY
	(
	UserProfileID
	) REFERENCES dbo.UserProfiles
	(
	ID
	) ON UPDATE  NO ACTION 
	 ON DELETE  CASCADE 
	
GO
ALTER TABLE dbo.UserProfile_Conf SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
