


  ALTER TABLE UserProfile_Conf
	ALTER COLUMN NTUserName nvarchar(200) not null
ALTER TABLE UserProfile_Conf   
ADD CONSTRAINT AK_NTUserName UNIQUE (NTUserName);