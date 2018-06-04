


ALTER TABLE UserProfile_Conf
ALTER COLUMN NTUserName nvarchar(200) not null

ALTER TABLE UserProfile_Conf   
ADD CONSTRAINT AK_NTUserName UNIQUE (NTUserName);

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
