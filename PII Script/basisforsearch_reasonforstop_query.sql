SELECT distinct
    [RIPA].[dbo].[JSONSTOP_Person_ReasonForStop_vw].[StopID]
      ,[PID]
      ,[reasonForStopExplanation]
FROM [RIPA].[dbo].[JSONSTOP_Person_ReasonForStop_vw]
JOIN [RIPA].[dbo].[JSONSTOP_Main_JSON_vw]
  ON [RIPA].[dbo].[JSONSTOP_Main_JSON_vw].[StopID] =
       [RIPA].[dbo].[JSONSTOP_Person_ReasonForStop_vw].[StopID]
JOIN [RIPA].[dbo].[Stops]
  ON [RIPA].[dbo].[JSONSTOP_Main_JSON_vw].[StopID] =
    	[RIPA].[dbo].[Stops].[ID]
WHERE
       JSON_VALUE([RIPA].[dbo].[Stops].[JsonStop], '$.date') between 
	   	'2020-01-01' and '2020-12-31' --Update Dates
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
JOIN [RIPA].[dbo].[Stops]
  ON [RIPA].[dbo].[JSONSTOP_Main_JSON_vw].[StopID] =
       [RIPA].[dbo].[Stops].[ID]
WHERE
       JSON_VALUE([RIPA].[dbo].[Stops].[JsonStop], '$.date') between
        '2020-01-01' and '2020-12-31' --Update Dates
       and basisForSearchExplanation != ''
order by 
       [JSONSTOP_Person_ActionsTaken_BasisForSearch_vw].[StopID]
