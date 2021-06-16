USE [RIPA]
GO
/****** Object:  Table [dbo].[Stops]    Script Date: 6/15/2021 4:13:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Stops](
	[ID] [int] IDENTITY(10000,1) NOT NULL,
	[Time] [datetime] NOT NULL,
	[JsonStop] [nvarchar](max) NULL,
	[JsonDojStop] [nvarchar](max) NULL,
	[PersonCount] [int] NOT NULL,
	[Latitude] [nvarchar](55) NULL,
	[Longitude] [nvarchar](55) NULL,
	[Beat] [nvarchar](10) NULL,
	[JsonInstrumentation] [nvarchar](max) NULL,
	[Status] [nvarchar](20) NULL,
	[StatusMessage] [nvarchar](max) NULL,
	[UserProfileID] [int] NOT NULL,
	[SubmissionsID] [int] NULL,
	[JsonSubmissions] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.Stops] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[JSONSTOP_Main_JSON_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[JSONSTOP_Main_JSON_vw]
AS


SELECT DISTINCT 
	  Stops.ID AS StopID
	, Stops.Time AS StopDateTime
	, Stops.UserProfileID
	, Stops.Status
	, Stops.PersonCount AS StopPersonCount
	, Stops.Latitude
	, Stops.Longitude
	, stop_main.*	
    , stop_location.*
FROM Stops
	OUTER APPLY OPENJSON(JsonStop)
	WITH (
		  ori VARCHAR(50) '$.ori'
		, agency VARCHAR(50) '$.agency'
		, officerID INT '$.officerID'
		, ExpYears INT '$.ExpYears'
		, officerAssignment_type NVARCHAR(max) '$.officerAssignment.type'
		, officerAssignment_type_other NVARCHAR(max) '$.officerAssignment.otherType'
		--, stopDate datetime '$.date'
		, stopDate VARCHAR(50) '$.date'
		--, stopTime NVARCHAR(max) '$.time'
		--, stopTime datetime2(7) '$.time'
		, stopTime VARCHAR(50) '$.time'
		, stopDuration INT '$.stopDuration'
		, stopInResponseToCFS BIT '$.stopInResponseToCFS'
		) as stop_main
    OUTER APPLY OPENJSON(JsonStop,'$.location')
	WITH (
		  blockNumber VARCHAR(50) '$.blockNumber'		
		, street NVARCHAR(max) '$.streetName'
		, intersection NVARCHAR(max) '$.intersection' 
		, highwayExit NVARCHAR(max) '$.highwayExit'
		, landMark NVARCHAR(max) '$.landMark'		
		, city NVARCHAR(max) '$.city.codes[0].text'
		, beat NVARCHAR(max) '$.beat.codes[0].code'
		, beatName NVARCHAR(max) '$.beat.codes[0].text'
		, isSchool BIT '$.school'
		, schoolName NVARCHAR(max) '$.schoolName.codes[0].text'
		)
	AS stop_location
    OUTER apply OPENJSON(JsonStop,'$.ListPerson_Stopped')
	with (
		  PID int '$.PID'
		)
	AS stop_person
where stop_person.PID != 0 

GO
/****** Object:  View [dbo].[JSONSTOP_Person_Perceived_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[JSONSTOP_Person_Perceived_vw]
AS 

 select distinct 
         CONCAT(Stops.ID,stop_person.PID) As STOPID_PID,
         Stops.ID as StopID 
       , stop_person.PID
       , stop_person.isStudent
       , stop_person.perceivedLimitedEnglish
       , stop_person.perceivedAge
       , stop_person.perceivedGender
       , stop_person.genderNonconforming
       , stop_person.perceivedLgbt
       , stop_person_reasonForStop.reasonForStop
       , stop_person.reasonForStopExplanation   
              , stop_person_reasonForStop_codes.*
from Stops    
       OUTER apply OPENJSON(JsonStop,'$.ListPerson_Stopped')
       with (
                PID int '$.PID'
              , isStudent bit '$.Is_Stud'
              , perceivedLimitedEnglish bit '$.perceivedLimitedEnglish'
              , perceivedAge int '$.perceivedAge'
              , perceivedGender nvarchar(max) '$.perceivedGender'
              , genderNonconforming bit '$.genderNonconforming'
              , perceivedLgbt nvarchar(max) '$.perceivedLgbt'        
              , reasonForStop nvarchar(max) '$.reasonForStop' as JSON
              , reasonForStopExplanation NVARCHAR(max) '$.reasonForStopExplanation'             
              )
       AS stop_person             
              OUTER APPLY OPENJSON(stop_person.reasonForStop) 
                           WITH(
                                  reasonForStop nvarchar(max) '$.reason'                               
                                  ) 
              AS stop_person_reasonForStop
       OUTER APPLY OPENJSON(stop_person.reasonForStop, '$.codes') 
                                  WITH(
                                         reasonForStopcode nvarchar(max) '$.code'
                                         ,reasonForStopCodeText NVARCHAR(max) '$.text'                               
                                         ) 
                     AS stop_person_reasonForStop_codes 
where stop_person.PID != 0 
GO
/****** Object:  View [dbo].[JSONSTOP_Person_PerceivedRace_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/* Person perceived race info */

CREATE VIEW [dbo].[JSONSTOP_Person_PerceivedRace_vw]
AS 



select distinct 
	 CONCAT(Stops.ID,stop_person.PID) As STOPID_PID
	, Stops.ID as StopID	
	, stop_person.PID
	, stop_person_race.perceivedRace
from Stops	
	OUTER apply OPENJSON(JsonStop,'$.ListPerson_Stopped')
	with (
		  PID int '$.PID'
		, perceivedraces nvarchar(max) '$.perceivedRace' as JSON
		)
	AS stop_person
		OUTER APPLY OPENJSON(stop_person.perceivedraces) 
				WITH(
					 perceivedRace   nvarchar(max) '$.race'
					) 
		AS stop_person_race
where stop_person.PID != 0 
GO
/****** Object:  View [dbo].[JSONSTOP_Person_PerceivedDisability_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[JSONSTOP_Person_PerceivedDisability_vw]
AS 


select distinct 
	  CONCAT(Stops.ID,stop_person.PID) As STOPID_PID
	, Stops.ID as StopID	
	, stop_person.PID
	, stop_person_disability.perceivedOrKnownDisability
from Stops	
	OUTER apply OPENJSON(JsonStop,'$.ListPerson_Stopped')
	with (
		  PID int '$.PID'
		, perceivedOrKnownDisabilities NVARCHAR(max) '$.perceivedOrKnownDisability' as JSON
		)
	AS stop_person		
		OUTER APPLY OPENJSON(stop_person.perceivedOrKnownDisabilities) 
				WITH(
					 perceivedOrKnownDisability nvarchar(max) '$.disability'
					) 
		AS stop_person_disability
where stop_person.PID != 0 
GO
/****** Object:  View [dbo].[JSONSTOP_Person_ReasonForStop_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[JSONSTOP_Person_ReasonForStop_vw]
AS
select distinct 
	  Stops.ID as StopID
	, CONCAT(Stops.ID,stop_person.PID) As STOPID_PID	
    , stop_person.PID
	, stop_person_reasonForStop.reasonForStop
	, stop_person_reasonForStop_details.*
	, stop_person_reasonForStop_codes.*
	, stop_person.reasonForStopExplanation	
from Stops	
	OUTER apply OPENJSON(JsonStop,'$.ListPerson_Stopped')
	with (
		  PID int '$.PID'		
		, reasonForStop nvarchar(max) '$.reasonForStop' as JSON
		, reasonForStopExplanation NVARCHAR(max) '$.reasonForStopExplanation'		
		)
	AS stop_person		
		OUTER APPLY OPENJSON(stop_person.reasonForStop) 
				WITH(
					reasonForStop nvarchar(max) '$.reason'					
					) 
		AS stop_person_reasonForStop
			OUTER APPLY OPENJSON(stop_person.reasonForStop, '$.details') 
					WITH(
						reasonForStopDetail nvarchar(max) '$.reason'				
						) 
			AS stop_person_reasonForStop_details			
			OUTER APPLY OPENJSON(stop_person.reasonForStop, '$.codes') 
					WITH(
						 reasonForStopcode nvarchar(max) '$.code'
						,reasonForStopCodeText NVARCHAR(max) '$.text'					
						) 
			AS stop_person_reasonForStop_codes			
where stop_person.PID != 0 
GO
/****** Object:  View [dbo].[JSONSTOP_Person_ActionsTaken_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* Person actions taken*/
CREATE VIEW [dbo].[JSONSTOP_Person_ActionsTaken_vw]
AS 


select distinct 
	CONCAT(Stops.ID,stop_person.PID) As STOPID_PID
	,  Stops.ID as StopID	
	, stop_person.PID	
	, stop_person_actions.*
from Stops
	OUTER apply OPENJSON(JsonStop,'$.ListPerson_Stopped')
	with (
		  PID int '$.PID'		
		, actionsTakenDuringStop NVARCHAR(max) '$.actionsTakenDuringStop' as JSON		
		)
	AS stop_person		
		OUTER APPLY OPENJSON(stop_person.actionsTakenDuringStop) 
				WITH(
					  actionTakenDuringStop nvarchar(max) '$.action'
					, personSearchConsentGiven  nvarchar(max) '$.personSearchConsentGiven'
					, propertySearchConsentGiven NVARCHAR(max) '$.propertySearchConsentGiven'
					) 
		AS stop_person_actions						
where stop_person.PID != 0

GO
/****** Object:  View [dbo].[JSONSTOP_Person_ActionsTaken_BasisForSeizure_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[JSONSTOP_Person_ActionsTaken_BasisForSeizure_vw]
AS


select distinct 
	  CONCAT(Stops.ID,stop_person.PID) As STOPID_PID
	, Stops.ID as StopID	
	, stop_person.PID	
	, stop_person_basisForPropertySeizure.*
from Stops
	OUTER apply OPENJSON(JsonStop,'$.ListPerson_Stopped')
	with (
		  PID int '$.PID'		
		, basisForPropertySeizure NVARCHAR(max) '$.basisForPropertySeizure' as JSON		
		)
	AS stop_person				
		OUTER APPLY OPENJSON(stop_person.basisForPropertySeizure) 
				WITH(
					basisForPropertySeizure nvarchar(max) '$.basis'
					) 
		AS stop_person_basisForPropertySeizure
where stop_person.PID != 0 

GO
/****** Object:  View [dbo].[JSONSTOP_Person_ActionsTaken_PropertySeized_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE VIEW [dbo].[JSONSTOP_Person_ActionsTaken_PropertySeized_vw]
AS


select distinct 
	 CONCAT(Stops.ID,stop_person.PID) As STOPID_PID
	, Stops.ID as StopID	
	, stop_person.PID	
	, stop_person_seizedProperty.*
from Stops
	OUTER apply OPENJSON(JsonStop,'$.ListPerson_Stopped')
	with (
		  PID int '$.PID'		
		, seizedProperty NVARCHAR(max) '$.typeOfPropertySeized' as JSON
		)
	AS stop_person				
		OUTER APPLY OPENJSON(stop_person.seizedProperty) 
				WITH(
					typeOfPropertySeized nvarchar(max) '$.type'
					) 
		AS stop_person_seizedProperty					
where stop_person.PID != 0 
GO
/****** Object:  View [dbo].[JSONSTOP_Person_ContrabandDiscovered_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* Person contraband */
CREATE VIEW [dbo].[JSONSTOP_Person_ContrabandDiscovered_vw]
AS 

select distinct
	  CONCAT(Stops.ID,stop_person.PID) As STOPID_PID 
	,  Stops.ID as StopID
	, stop_person.PID	
	, stop_person_contraband.*
from Stops	
	OUTER apply OPENJSON(JsonStop,'$.ListPerson_Stopped')
	with (
		  PID int '$.PID'
		, contraband NVARCHAR(max) '$.contrabandOrEvidenceDiscovered' as JSON
		)
	AS stop_person
		OUTER APPLY OPENJSON(stop_person.contraband) 
				WITH(
					contrabandOrEvidenceDiscovered nvarchar(max) '$.contraband'
					) 
		AS stop_person_contraband			
where stop_person.PID != 0 
GO
/****** Object:  View [dbo].[JSONSTOP_Person_ResultOfStop_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[JSONSTOP_Person_ResultOfStop_vw]
AS 

select distinct 
	  CONCAT(Stops.ID,stop_person.PID) As STOPID_PID
	, Stops.ID as StopID
	, stop_person.PID	
	, stop_person_resultOfStop.resultOfStop
	, stop_person_resultOfStop_codes.*
from Stops	
	OUTER apply OPENJSON(JsonStop,'$.ListPerson_Stopped')
	with (
		  PID int '$.PID'
          , resultOfStop NVARCHAR(max) '$.resultOfStop' as JSON
		)
	AS stop_person
		OUTER APPLY OPENJSON(stop_person.resultOfStop) 
				WITH(
					  resultOfStop nvarchar(max) '$.result'	
					, codes NVARCHAR(max) '$.codes' as JSON				
					) 
		AS stop_person_resultOfStop
			OUTER APPLY OPENJSON(stop_person_resultOfStop.codes) 
					WITH(
						  resultOfStopcode nvarchar(max) '$.code'
						, resultOfStopcodeText NVARCHAR(max) '$.text'					
						) 
			AS stop_person_resultOfStop_codes				
where stop_person.PID != 0
GO
/****** Object:  View [dbo].[JSONSTOP_Person_ActionsTaken_BasisForSearch_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[JSONSTOP_Person_ActionsTaken_BasisForSearch_vw]
AS 

select distinct 
	  CONCAT(Stops.ID,stop_person.PID) As STOPID_PID 
	, Stops.ID as StopID	
	, stop_person.PID	
	, stop_person_basisForSearch.* 
	, stop_person.basisForSearchExplanation
	--, CASE WHEN  stop_person_basisForSearch.basisForSearch is null THEN 'No Search Conducted'
	--	ELSE  stop_person_basisForSearch.basisForSearch 
	--	END
from Stops
	OUTER apply OPENJSON(JsonStop,'$.ListPerson_Stopped')
	with (
		  PID int '$.PID'		
		, basisForSearch NVARCHAR(max) '$.basisForSearch' as JSON
		, basisForSearchExplanation NVARCHAR(max) '$.basisForSearchBrief'
		)
	AS stop_person		
		OUTER APPLY OPENJSON(stop_person.basisForSearch) 
				WITH(
					basisForSearch nvarchar(max) '$.basis'
					) 
		AS stop_person_basisForSearch
where stop_person.PID != 0 --and stop_person_basisForSearch.basisForSearch is not null
GO
/****** Object:  Table [dbo].[UserProfile_Conf]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserProfile_Conf](
	[ID] [int] IDENTITY(100000000,1) NOT NULL,
	[NTUserName] [nvarchar](200) NOT NULL,
	[UserProfileID] [int] NOT NULL,
 CONSTRAINT [PK_dbo.UserProfile_Conf] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [AK_NTUserName] UNIQUE NONCLUSTERED 
(
	[NTUserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[TemporalTrace_JSONv2_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[TemporalTrace_JSONv2_vw]
AS
/* Temporal Trace, denormalized. VIEW TemporalTrace_JSON(v2)*/ SELECT STOPS.ID AS StopID, UserProfile_Conf.NTUserName AS UserID, latitude, longitude, JSON_VALUE(JsonInstrumentation, '$.template') AS Template, 
                         JSON_VALUE(JsonInstrumentation, '$.cacheFlag') AS CachedStop, json_a.startDate AS StopDate, json_a.startTimeStamp AS StopStartTime, json_b.formPartFilter AS Step, json_b.startTimeStamp AS StepStartTime, 
                         json_b.endTimeStamp AS StepEndTime, CONVERT(varchar(8), DATEADD(second, DATEDIFF(second, json_b.startTimeStamp, json_b.endTimeStamp), 0), 114) AS StepDurationFormatted, DATEDIFF(second, 
                         json_b.startTimeStamp, json_b.endTimeStamp) AS StepDurationInSeconds, CONVERT(varchar(8), DATEADD(second, DATEDIFF(second, json_a.startTimeStamp, json_b.endTimeStamp), 0), 114) AS StopDurationFormatted, 
                         DATEDIFF(second, json_a.startTimeStamp, json_b.endTimeStamp) AS StopDurationInSeconds
FROM            Stops /*CROSS APPLY QUERYJSON(JsonInstrumentation, '$.cacheFlag') AS json*/ CROSS APPLY OPENJSON(JsonInstrumentation, '$.temporalTrace') WITH (startDate datetime2 '$.startDate', 
                         startTimeStamp datetime2 '$.startTimeStamp', stepTrace nvarchar(max) '$.stepTrace' AS JSON) AS json_a CROSS APPLY OPENJSON(json_a.stepTrace) WITH (formPartFilter int '$.formPartFilter', 
                         startTimeStamp datetime2 '$.startTimeStamp', endTimeStamp datetime2 '$.endTimeStamp') AS json_b JOIN
                         UserProfile_Conf ON Stops.UserProfileID = UserProfile_Conf.UserProfileID
GO
/****** Object:  View [dbo].[StatusMessage_JSON_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[StatusMessage_JSON_vw]
AS
SELECT        row_number() OVER (ORDER BY Stops.ID) AS nid, Stops.ID AS StopID, Stops.Status AS StopStatus, msgs.*, submissionStatus.submissionID, submissionStatus.edited
FROM            dbo.Stops OUTER APPLY OPENJSON(StatusMessage, '$.Messages') WITH (code nvarchar(max) '$.Code', msg nvarchar(max) '$.Message') AS msgs OUTER APPLY OPENJSON(JsonSubmissions, '$.SubmissionInfo') 
                         WITH (submissionID int '$.submissionID', edited bit '$.edited') AS submissionStatus       
GO
/****** Object:  View [dbo].[StopOfficerIDDateTime_JSON_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[StopOfficerIDDateTime_JSON_vw]
AS
SELECT        stop_main.*, Stops.ID AS ID
FROM            Stops OUTER APPLY OPENJSON(JsonStop) WITH (officerID varchar(50) '$.officerID', stopDate VARCHAR(50) '$.date', stopTime VARCHAR(50) '$.time') AS stop_main
GO
/****** Object:  View [dbo].[JSONSTOP_Person_ReasonForStopDetail_vw]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[JSONSTOP_Person_ReasonForStopDetail_vw]
AS
select 
    CONCAT(Stops.ID,stop_person.PID) As STOPID_PID
	, stop_person_reasonForStop_details.* 
from Stops	
	OUTER apply OPENJSON(JsonStop,'$.ListPerson_Stopped')
	with (
		  PID int '$.PID'		
		, reasonForStop nvarchar(max) '$.reasonForStop' as JSON
		, reasonForStopExplanation NVARCHAR(max) '$.reasonForStopExplanation'		
		)
	AS stop_person		
		OUTER APPLY OPENJSON(stop_person.reasonForStop) 
				WITH(
					reasonForStop nvarchar(max) '$.reason'					
					) 
		AS stop_person_reasonForStop
			OUTER APPLY OPENJSON(stop_person.reasonForStop, '$.details') 
					WITH(
						reasonForStopDetail nvarchar(max) '$.reason'				
						) 
			AS stop_person_reasonForStop_details			
			OUTER APPLY OPENJSON(stop_person.reasonForStop, '$.codes') 
					WITH(
						 reasonForStopcode nvarchar(max) '$.code'
						,reasonForStopCodeText NVARCHAR(max) '$.text'					
						) 
			AS stop_person_reasonForStop_codes			
where stop_person.PID != 0 AND stop_person_reasonForStop_details.reasonForStopDetail <> ''
AND CONCAT(Stops.ID,stop_person.PID) NOT IN (
    SELECT CONCAT(Stops.ID,stop_person.PID)
	FROM Stops    
       OUTER apply OPENJSON(JsonStop,'$.ListPerson_Stopped')
       with (
                PID int '$.PID'           
              )
       AS stop_person             
	where stop_person.PID != 0
	GROUP BY CONCAT(Stops.ID,stop_person.PID)
	HAVING COUNT(*) > 1
)
GO
/****** Object:  Table [dbo].[Beats]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Beats](
	[Beat] [varchar](3) NOT NULL,
	[Community] [varchar](128) NOT NULL,
	[Command] [varchar](128) NOT NULL,
	[CommandAuditGroup] [nchar](50) NULL,
	[CommandAuditSize] [char](1) NULL,
 CONSTRAINT [pk_Beats] PRIMARY KEY CLUSTERED 
(
	[Beat] ASC,
	[Community] ASC,
	[Command] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Cities]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Cities](
	[State] [varchar](2) NULL,
	[City] [varchar](50) NOT NULL,
	[County] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[City] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CJISOffenseCodes]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CJISOffenseCodes](
	[Offense Validation CD] [varchar](1) NULL,
	[Offense Code] [int] NOT NULL,
	[Offense Txn Type CD] [varchar](1) NULL,
	[Offense Statute] [varchar](15) NULL,
	[Offense Type of Statute CD] [varchar](2) NULL,
	[Statute Literal 25] [varchar](50) NULL,
	[Offense Default Type of Charge] [varchar](1) NULL,
	[Offense Type of Charge] [varchar](1) NULL,
	[Offense Literal Identifier CD] [varchar](5) NULL,
	[Offense Degree] [varchar](1) NULL,
	[BCS Hierarchy CD] [varchar](10) NULL,
	[Offense Enacted] [varchar](10) NULL,
	[Offense Repealed] [varchar](10) NULL,
	[ALPS Cognizant CD] [varchar](1) NULL,
	[Add_Date Time] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[Offense Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[schools]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[schools](
	[CDS_Code] [varchar](50) NOT NULL,
	[Status] [varchar](50) NULL,
	[County] [varchar](50) NULL,
	[District] [varchar](50) NULL,
	[schoolname] [varchar](50) NULL,
	[sc_MailCity] [varchar](50) NULL,
	[sc_DOCType] [varchar](50) NULL,
	[Schooltype] [varchar](50) NULL,
	[sc_Latitude] [varchar](50) NULL,
	[sc_Longitude] [varchar](50) NULL,
PRIMARY KEY NONCLUSTERED 
(
	[CDS_Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StopChangeAudits]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StopChangeAudits](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[OrigJsonStop] [nvarchar](max) NOT NULL,
	[ModJsonStop] [nvarchar](max) NOT NULL,
	[Reason] [nvarchar](max) NOT NULL,
	[NTUserName] [nvarchar](200) NOT NULL,
	[Time] [datetime] NOT NULL,
	[StopID] [int] NOT NULL,
 CONSTRAINT [PK_StopChangeAudits] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Submissions]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Submissions](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[StartDate] [datetime] NOT NULL,
	[EndDate] [datetime] NULL,
	[Status] [nvarchar](20) NULL,
	[LogFile] [nvarchar](55) NULL,
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
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserProfiles]    Script Date: 6/15/2021 4:13:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserProfiles](
	[ID] [int] IDENTITY(111101000,1) NOT NULL,
	[Agency] [nvarchar](2) NULL,
	[ORI] [nvarchar](20) NULL,
	[Years] [int] NOT NULL,
	[Assignment] [nvarchar](255) NULL,
	[AssignmentOther] [nvarchar](max) NULL,
	[AssignmentKey] [int] NOT NULL,
	[ContractFundedPosition] [bit] NULL,
	[ContractCity] [nvarchar](50) NULL,
	[ContractFundedEvent] [bit] NULL,
	[ContractEvent] [nvarchar](50) NULL,
 CONSTRAINT [PK_dbo.UserProfiles] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[UserProfile_Conf]  WITH CHECK ADD  CONSTRAINT [FK_dbo.UserProfile_Conf_dbo.UserProfiles_UserProfileID] FOREIGN KEY([UserProfileID])
REFERENCES [dbo].[UserProfiles] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[UserProfile_Conf] CHECK CONSTRAINT [FK_dbo.UserProfile_Conf_dbo.UserProfiles_UserProfileID]
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
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'JSONSTOP_Main_JSON_vw'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'JSONSTOP_Main_JSON_vw'
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
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 3045
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
