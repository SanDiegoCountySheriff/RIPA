# RIPA
California Racial and Identity Profiling Act [(RIPA - AB953)](https://oag.ca.gov/ab953/regulations)

The San Diego County Sheriff's Department is developing this application to share and collaborate with the California L.E. community at large.

The RIPA App is a mobile first web application for phones and MDCs to capture stop information directly in the field. It is completely stand-alone and has no third party system integrations.

## Demo Site

You can try out the application here: [RIPA Demo Site](https://ripademo.azurewebsites.net)

## Feature Highlight

* Semi offline
  * Cached lookups
  * Stop in progress
* Templates
* Pull forward on multiples
* Reverse geocoding
* Instrumentation
* Dark Mode
* Regulation reference links
* JSON documents
* **CA DOJ Submission tool with error correction capability**
* Tabular views for JSON data

## Requirements

The application is built using MSFT ASP.NET MVC/WEBAPI with Entity Foundation and ReactJS views. 

* IIS (SSL is recommended)
* SQL Server 2016
* Visual Studio 
* Windows Authentication

## How To Get Started

**Database Setup** - On the package manager console in VS, add a new migration `add-migration myMigration` and update the database `update-database`, which you will need to point to in the web.config file. Alternatively, if you don't want to mess with migrations, you can implement the SQL script in the SQL folder (database_fromscratch.sql).

The SQL folder also has a script for the lookup tables, along with sample data. It is recommended that you set up a repeatable process to update the lookup tables from California DoJ directly.

**Releases** - PublishOutput.zip is a release build with a generic web.config. This will allow you to use the latest code without compiling in Visual Studio. Make sure to update it with your agency's specific information.


**IIS Setup** - Set up a new web application, turn on Windows Authentication and set up your port 443/https bindings, a dev cert will suffice, unless you are setting up production. Make sure the application pool identity has read/write access to the database you set up in the previous step.

RIPALogs Directory setup for logging DOJ Submissions
   If you have 2 servers, the following steps should be done on both.
1.	Create RIPALogs directory under C: or D: drive.
  *	Right click on the directory and get to Properties.
  *	Under Security tab, click on Edit and add your service account and give it full access to this directory.
2.	In IIS "Add Virtual Directory" under your RIPA website.
  *	Alias: RIPALogs
  *	Physical path: D:\RIPALogs or C:\RIPALogs
3. In Web.config:
  ``` xml
  <appSettings>
    <add key="LogFilePath1" value="C:\RIPALogs" />
    <add key="Server1" value="\\server01\" />
    <add key="Server2" value="\\server02\" />
  </appSettings>
  ```
  Or if you don't have a second server, for load balancing, just leave the value for Server1 and Server2 empty:
  ``` xml
  <appSettings>
    <add key="LogFilePath1" value="C:\RIPALogs" />
    <add key="Server1" value="" />
    <add key="Server2" value="" />
  </appSettings>
  ```

**Update Web.config** - Make sure you update the app settings in Web.config with your agency specific information.
``` xml
<add key="reverseGeoURI" value="https://www.mysite.us/arcgis/rest/....."/><!-- See section for instructions about using the ESRI world geocoder -->
<add key="reverseBeatURI" value="https://myReverseBeatGeocodingService" />
<add key="agency" value="AG"/><!-- Must be 2 characters in length-->
<add key="ori" value="CA0000000"/>
<add key="test" value="false" />
<add key="forceCacheUpdate" value="false" />
<add key="allowedBackDateHours" value="24" />
<add key="expireCacheDays" value="14" />
<add key="domain" value="myDomain" /> <!-- NetBIOS -->
<add key="requireGroupMembership" value="true" />
<add key="authorized" value="User AD Group" />
<add key="authorizedAdmin" value="Admin AD Group" />
<add key="useBeats" value="0" /> <!-- 0 = Don't use beats, 1 = Show beats, 2 = Make beats mandatory -->
<add key="useAdditionalQuestions" value="0" /><!--  0 = Don't use, 1 = Use -->
<add key="useContractCity" value="0" /><!-- 0 = Don't use, 1 = Use-->
<add key="useContractEvent" value="0" /><!-- 0 = Don't use, 1 = Use-->
<add key="county" value="Your County" /><add key="DOJWebApiUrl" value="https://dojTestSubmissionURL" />
<add key="DOJWebApiUrl" value="https://dojSubmissionURL" />
<add key="DOJUrlConnectTest" value="https://dojTestSubmissionURL" />
<add key="LogFilePath1" value="" />
<add key="Server1" value="" />
<add key="Server2" value="" />
<add key="InitStrtSubDate" value="Start date of RIPA Collection YYYY-MM-DD" />
```


## Using the ESRI World Geocoder

If you don't have a local ESRI locator available for your agency you can use this public ESRI endpoint to implement reverse geocoding which uses your device's geolocation information if available after user consent.

**Update Web.config** - Set the reverseGeoURI key as follows.
``` xml
<add key="reverseGeoURI" value="https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=json&featureTypes=&location="/>
```

In the file RIPASTOP/Scripts/react/RIPAForm.jsx replace the code starting on line 449-463 with this:

``` C#
var streetNum = e.address.Address.substr(0, e.address.Address.indexOf(' '));
if (isNaN(streetNum)) {
    newblockNumber = '';
    newStreetName = e.address.Address;
}
else {
    newblockNumber = this.floorInteger(streetNum);
    newStreetName = e.address.Address.substr(e.address.Address.indexOf(' ') + 1);
}
// check if e.address.City is in this.state.codes.cities 
var city = "";
if (this.state.codes.CountyCities.includes(e.address.City.toUpperCase()) || this.state.codes.OutOfCountyCities.includes(e.address.City.toUpperCase())) {
    city = e.address.City
}           
``` 
