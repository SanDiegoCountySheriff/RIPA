
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 10/20/2020 10:16:50
-- Generated from EDMX file: C:\Projects\GitHub\Repos\SanDiegoCountySheriff\RIPA\RIPASTOP\Models\Lookups.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [JSON_SIA_TEST];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------


-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[Beats]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Beats];
GO
IF OBJECT_ID(N'[dbo].[Cities]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Cities];
GO
IF OBJECT_ID(N'[dbo].[CJISOffenseCodes]', 'U') IS NOT NULL
    DROP TABLE [dbo].[CJISOffenseCodes];
GO
IF OBJECT_ID(N'[dbo].[schools]', 'U') IS NOT NULL
    DROP TABLE [dbo].[schools];
GO
IF OBJECT_ID(N'[dbo].[StopChangeAudits]', 'U') IS NOT NULL
    DROP TABLE [dbo].[StopChangeAudits];
GO
IF OBJECT_ID(N'[dbo].[Submissions]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Submissions];
GO
IF OBJECT_ID(N'[JSON_SIA_TESTModelStoreContainer].[StatusMessage_JSON_vw]', 'U') IS NOT NULL
    DROP TABLE [JSON_SIA_TESTModelStoreContainer].[StatusMessage_JSON_vw];
GO
IF OBJECT_ID(N'[JSON_SIA_TESTModelStoreContainer].[StopOfficerIDDateTime_JSON_vw]', 'U') IS NOT NULL
    DROP TABLE [JSON_SIA_TESTModelStoreContainer].[StopOfficerIDDateTime_JSON_vw];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Beats'
CREATE TABLE [dbo].[Beats] (
    [Beat] varchar(3)  NOT NULL,
    [Community] varchar(128)  NOT NULL,
    [Command] varchar(128)  NOT NULL
);
GO

-- Creating table 'Cities'
CREATE TABLE [dbo].[Cities] (
    [State] varchar(2)  NULL,
    [City] varchar(50)  NOT NULL,
    [County] varchar(50)  NULL
);
GO

-- Creating table 'CJISOffenseCodes'
CREATE TABLE [dbo].[CJISOffenseCodes] (
    [Offense_Validation_CD] varchar(1)  NULL,
    [Offense_Code] int  NOT NULL,
    [Offense_Txn_Type_CD] varchar(1)  NULL,
    [Offense_Statute] varchar(15)  NULL,
    [Offense_Type_of_Statute_CD] varchar(2)  NULL,
    [Statute_Literal_25] varchar(50)  NULL,
    [Offense_Default_Type_of_Charge] varchar(1)  NULL,
    [Offense_Type_of_Charge] varchar(1)  NULL,
    [Offense_Literal_Identifier_CD] varchar(5)  NULL,
    [Offense_Degree] varchar(1)  NULL,
    [BCS_Hierarchy_CD] varchar(10)  NULL,
    [Offense_Enacted] varchar(10)  NULL,
    [Offense_Repealed] varchar(10)  NULL,
    [ALPS_Cognizant_CD] varchar(1)  NULL,
    [Add_Date_Time] varchar(10)  NULL
);
GO

-- Creating table 'schools'
CREATE TABLE [dbo].[schools] (
    [CDS_Code] varchar(50)  NOT NULL,
    [Status] varchar(50)  NULL,
    [County] varchar(50)  NULL,
    [District] varchar(50)  NULL,
    [schoolname] varchar(50)  NULL,
    [sc_MailCity] varchar(50)  NULL,
    [sc_DOCType] varchar(50)  NULL,
    [Schooltype] varchar(50)  NULL,
    [sc_Latitude] varchar(50)  NULL,
    [sc_Longitude] varchar(50)  NULL
);
GO

-- Creating table 'StopOfficerIDDateTime_JSON_vw'
CREATE TABLE [dbo].[StopOfficerIDDateTime_JSON_vw] (
    [officerID] nvarchar(4000)  NULL,
    [stopDate] nvarchar(4000)  NULL,
    [StopTime] nvarchar(4000)  NULL,
    [ID] int IDENTITY(1,1) NOT NULL
);
GO

-- Creating table 'StopChangeAudits'
CREATE TABLE [dbo].[StopChangeAudits] (
    [ID] int IDENTITY(1,1) NOT NULL,
    [OrigJsonStop] nvarchar(max)  NULL,
    [ModJsonStop] nvarchar(max)  NULL,
    [Reason] nvarchar(max)  NULL,
    [NTUserName] nvarchar(max)  NULL,
    [Time] datetime  NULL,
    [StopID] int  NOT NULL
);
GO

-- Creating table 'Submissions'
CREATE TABLE [dbo].[Submissions] (
    [ID] int IDENTITY(1,1) NOT NULL,
    [StartDate] datetime  NOT NULL,
    [Status] nvarchar(max)  NULL,
    [LogFile] nvarchar(max)  NULL,
    [TotalProcessed] int  NULL,
    [TotalSuccess] int  NULL,
    [TotalRejected] int  NULL,
    [TotalWithErrors] int  NULL,
    [TotalHTTPErrors] int  NULL,
    [DateSubmitted] datetime  NULL,
    [EndDate] datetime  NULL
);
GO

-- Creating table 'StatusMessage_JSON_vw'
CREATE TABLE [dbo].[StatusMessage_JSON_vw] (
    [nid] bigint  NOT NULL,
    [StopID] int IDENTITY(1,1) NOT NULL,
    [StopStatus] nvarchar(max)  NULL,
    [code] nvarchar(max)  NULL,
    [msg] nvarchar(max)  NULL,
    [submissionID] int  NULL,
    [edited] bit  NULL
);
GO

-- Creating table 'ContractCities'
CREATE TABLE [dbo].[ContractCities] (
    [ContractCity] varchar(50)  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Beat], [Community], [Command] in table 'Beats'
ALTER TABLE [dbo].[Beats]
ADD CONSTRAINT [PK_Beats]
    PRIMARY KEY CLUSTERED ([Beat], [Community], [Command] ASC);
GO

-- Creating primary key on [City] in table 'Cities'
ALTER TABLE [dbo].[Cities]
ADD CONSTRAINT [PK_Cities]
    PRIMARY KEY CLUSTERED ([City] ASC);
GO

-- Creating primary key on [Offense_Code] in table 'CJISOffenseCodes'
ALTER TABLE [dbo].[CJISOffenseCodes]
ADD CONSTRAINT [PK_CJISOffenseCodes]
    PRIMARY KEY CLUSTERED ([Offense_Code] ASC);
GO

-- Creating primary key on [CDS_Code] in table 'schools'
ALTER TABLE [dbo].[schools]
ADD CONSTRAINT [PK_schools]
    PRIMARY KEY CLUSTERED ([CDS_Code] ASC);
GO

-- Creating primary key on [ID] in table 'StopOfficerIDDateTime_JSON_vw'
ALTER TABLE [dbo].[StopOfficerIDDateTime_JSON_vw]
ADD CONSTRAINT [PK_StopOfficerIDDateTime_JSON_vw]
    PRIMARY KEY CLUSTERED ([ID] ASC);
GO

-- Creating primary key on [ID] in table 'StopChangeAudits'
ALTER TABLE [dbo].[StopChangeAudits]
ADD CONSTRAINT [PK_StopChangeAudits]
    PRIMARY KEY CLUSTERED ([ID] ASC);
GO

-- Creating primary key on [ID] in table 'Submissions'
ALTER TABLE [dbo].[Submissions]
ADD CONSTRAINT [PK_Submissions]
    PRIMARY KEY CLUSTERED ([ID] ASC);
GO

-- Creating primary key on [nid] in table 'StatusMessage_JSON_vw'
ALTER TABLE [dbo].[StatusMessage_JSON_vw]
ADD CONSTRAINT [PK_StatusMessage_JSON_vw]
    PRIMARY KEY CLUSTERED ([nid] ASC);
GO

-- Creating primary key on [ContractCity] in table 'ContractCities'
ALTER TABLE [dbo].[ContractCities]
ADD CONSTRAINT [PK_ContractCities]
    PRIMARY KEY CLUSTERED ([ContractCity] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------