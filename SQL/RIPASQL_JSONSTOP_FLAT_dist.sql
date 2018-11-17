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

/* stop Main View */
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

/* Person result of stop */
CREATE VIEW [dbo].[JSONSTOP_Person_ResultOfStop_vw]
AS 
select distinct 
	  Stops.ID as StopID
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
where stop_person.PID != 0 --and Stops.ID= 18295
GO

/* Person perceived reason for stop info */
CREATE VIEW [dbo].[JSONSTOP_Person_ReasonForStop_vw]
AS
select distinct 
	  Stops.ID as StopID	
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

/* Person perceived race info */
CREATE VIEW [dbo].[JSONSTOP_Person_PerceivedRace_vw]
AS 
select distinct 
	  Stops.ID as StopID	
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

/* Person perceived disability info */
CREATE VIEW [dbo].[JSONSTOP_Person_PerceivedDisability_vw]
AS 
select distinct 
	  Stops.ID as StopID	
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

/* Person perceived info */
CREATE VIEW [dbo].[JSONSTOP_Person_Perceived_vw]
AS 
select distinct 
	  Stops.ID as StopID	
	, stop_person.PID
	, stop_person.isStudent
	, stop_person.perceivedLimitedEnglish
	, stop_person.perceivedAge
	, stop_person.perceivedGender
	, stop_person.genderNonconforming
	, stop_person.perceivedLgbt
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
		)
	AS stop_person
where stop_person.PID != 0 --and Stops.ID = 18295
GO

/* Person contraband */
CREATE VIEW [dbo].[JSONSTOP_Person_ContrabandDiscovered_vw]
AS 
select distinct 
	  Stops.ID as StopID
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

/* Person actions taken*/
CREATE VIEW [dbo].[JSONSTOP_Person_ActionsTaken_vw]
AS 
select distinct 
	  Stops.ID as StopID	
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

/* Person type of property seized */
CREATE VIEW [dbo].[JSONSTOP_Person_ActionsTaken_PropertySeized_vw]
AS
select distinct 
	  Stops.ID as StopID	
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


/* Person basis for property seizure*/
CREATE VIEW [dbo].[JSONSTOP_Person_ActionsTaken_BasisForSeizure_vw]
AS
select distinct 
	  Stops.ID as StopID	
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

CREATE VIEW [dbo].[JSONSTOP_Person_ActionsTaken_BasisForSearch_vw]
AS 
select distinct 
	  Stops.ID as StopID	
	, stop_person.PID	
	, stop_person_basisForSearch.*
	, stop_person.basisForSearchExplanation
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
where stop_person.PID != 0 
GO

