DECLARE @startDate VARCHAR(50) = '2018-11-01 00:00:00.000'
DECLARE @endDate VARCHAR(50) = '2018-12-03 00:00:00.000'


SELECT distinct 
	   [RIPA].[dbo].[JSONSTOP_Person_ReasonForStop_vw].[StopID]
      ,[PID]
      ,[reasonForStopExplanation]
FROM [RIPA].[dbo].[JSONSTOP_Person_ReasonForStop_vw]
JOIN [RIPA].[dbo].[JSONSTOP_Main_JSON_vw]
  ON [RIPA].[dbo].[JSONSTOP_Main_JSON_vw].[StopID] =
	 [RIPA].[dbo].[JSONSTOP_Person_ReasonForStop_vw].[StopID]
WHERE 
	stopDate between @startDate and @endDate 
ORDER BY 
	[RIPA].[dbo].[JSONSTOP_Person_ReasonForStop_vw].[StopID]

SELECT  distinct 
	   [JSONSTOP_Person_ActionsTaken_BasisForSearch_vw].[StopID]
      ,[PID]
      ,[basisForSearchExplanation]
FROM [RIPA].[dbo].[JSONSTOP_Person_ActionsTaken_BasisForSearch_vw]
JOIN [RIPA].[dbo].[JSONSTOP_Main_JSON_vw]
  ON [RIPA].[dbo].[JSONSTOP_Main_JSON_vw].[StopID] =
	 [RIPA].[dbo].[JSONSTOP_Person_ActionsTaken_BasisForSearch_vw].[StopID]
WHERE 
	stopDate between  @startDate and @endDate   
	and basisForSearchExplanation != ''
order by  
	[JSONSTOP_Person_ActionsTaken_BasisForSearch_vw].[StopID]
