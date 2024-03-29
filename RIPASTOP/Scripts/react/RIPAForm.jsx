﻿const Tags = ReactTags.WithContext;
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stop: {
                ori: '',
                agency: '',
                officerID: '',
                ExpYears: '',
                officerAssignment: { key: '', type: '', otherType: '' },
                contractFundedPosition: false,
                contractCity: {
                    codes: []
                },
                contractFundedEvent: false,
                contractEvent: '',
                date: '',
                time: '',
                location: {
                    toggleLocationOptions: false,
                    intersection: '',
                    blockNumber: '',
                    landMark: '',
                    streetName: '',
                    highwayExit: '',
                    city: {
                        codes: []
                    },
                    beat: {
                        codes: []
                    },
                    school: false,
                    schoolName: {
                        codes: []
                    },
                    outOfCounty: false,
                },
                stopDuration: '',
                stopInResponseToCFS: false,
                Person_Stopped: {
                    PID: '1',
                    Is_Stud: false, // Y/N
                    //Perc: {
                    perceivedRace: [],
                    perceivedLimitedEnglish: false,
                    perceivedOrKnownDisability: [],
                    perceivedAge: '',
                    perceivedGender: '',
                    genderNonconforming: false,
                    Gend: '',
                    gendNC: '',
                    perceivedLgbt: '',
                    //}
                    reasonForStop: '',
                    PerceptionKnown: '',
                    reasonForStopExplanation: '',
                    actionsTakenDuringStop: [],
                    contrabandOrEvidenceDiscovered: [],
                    basisForSearch: [],
                    basisForSearchBrief: '',
                    basisForPropertySeizure: [],
                    typeOfPropertySeized: [],
                    resultOfStop: []
                },
                ListPerson_Stopped: [],
            },
            latitude: null,
            longitude: null,
            changeAuditReason: '',
            editStop: 0,
            submissionEdit: 0,
            submissionID: '',
            useAdditionalQuestions: '0',
            useContractCity: '',
            useContractEvent: '',
            useBeats: '',
            forceCacheUpdate: false,
            allowedBackDateHours: '24',
            debug: false,
            toggleJson: false,
            toggleOfficerOptions: false,
            //outOfCounty: false,
            reverseGeoURI: '',
            reverseBeatURI: '',
            progress: 8,
            formPartFilter: '0',
            loader: false,
            personCount: 1,
            templates: {
                motor: {
                    Person_Stopped: {
                        PID: '1',
                        Is_Stud: false, // Y/N
                        //Perc: {
                        perceivedRace: [],
                        perceivedLimitedEnglish: false,
                        perceivedOrKnownDisability: [],
                        perceivedAge: '',
                        perceivedGender: '',
                        genderNonconforming: false,
                        Gend: '',
                        gendNC: '',
                        perceivedLgbt: '',
                        //}
                        reasonForStop: {
                            key: 1,
                            reason: "Traffic Violation",
                            details: [{ reason: "Moving Violation", key: 1 }],
                            codes: [{ code: "54106", text: "22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106" }]
                        },
                        PerceptionKnown: '',
                        reasonForStopExplanation: 'Speeding',
                        actionsTakenDuringStop: [{ action: "None", key: 24 }],
                        contrabandOrEvidenceDiscovered: [{ contraband: "None", key: 1 }],
                        basisForSearch: [],
                        basisForSearchBrief: '',
                        basisForPropertySeizure: [],
                        typeOfPropertySeized: [],
                        resultOfStop: [{
                            result: "Citation for infraction",
                            codes: [{ code: "54106", text: "22350 VC - UNSAFE SPEED:PREVAIL COND (I) 54106" }],
                            key: 3
                        }]
                    }
                },
                probation: {
                    Person_Stopped: {
                        PID: '1',
                        Is_Stud: false, // Y/N
                        //Perc: {
                        perceivedRace: [],
                        perceivedLimitedEnglish: false,
                        perceivedOrKnownDisability: [],
                        perceivedAge: '',
                        perceivedGender: '',
                        genderNonconforming: false,
                        Gend: '',
                        gendNC: '',
                        perceivedLgbt: '',
                        //}
                        reasonForStop: {
                            key: 3,
                            reason: "Known to be on Parole / Probation / PRCS / Mandatory Supervision",
                            details: [{ "reason": "", "key": "" }],
                            codes: []
                        },
                        PerceptionKnown: '',
                        reasonForStopExplanation: 'Subject/Location known to be Parole / Probation / PRCS / Mandatory Supervision',
                        actionsTakenDuringStop: [
                            { action: "Curbside detention", key: 4 },
                            { action: "Search of person was conducted", key: 18 },
                            { action: "Search of property was conducted", key: 20 }],
                        contrabandOrEvidenceDiscovered: [{ contraband: "None", key: 1 }],
                        basisForSearch: [{ basis: "Condition of parole / probation/ PRCS / mandatory supervision", key: 4 }],
                        basisForSearchBrief: '',
                        basisForPropertySeizure: [],
                        typeOfPropertySeized: [],
                        resultOfStop: [{ result: "No Action", codes: [], key: 1 }]
                    }
                }
            },
            //nightMode: false,
            instrumentation: {
                template: null,
                pullFromReasonCode: false,
                cacheFlag: false,
                lookupCacheDate: '',
                server: '',
                temporalTrace: {
                    startDate: moment().format('YYYY-MM-DD'), //componentDidMount
                    startTme: moment().format('HH:mm:ss'), //componentDidMount
                    startTimeStamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                    stepTrace: [
                        // {formPartFilter: '', timestamp: ''}
                    ]
                }
            },
            validationErrorMsg: {
                errorFlag: false
            },
            codes: {
            },
            codeDummy: []
        };
        this.radioSelection = this.radioSelection.bind(this);
        this.checkBoxSelection = this.checkBoxSelection.bind(this);
        this.radioNestedCheckBoxSelection = this.radioNestedCheckBoxSelection.bind(this);
        this.radioNestedRadioSelection = this.radioNestedRadioSelection.bind(this);
        this.updateBoolCheckBox = this.updateBoolCheckBox.bind(this);
        this.handleBlockChange = this.handleBlockChange.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.useLastLocation = this.useLastLocation.bind(this);
        this.updateDateTime = this.updateDateTime.bind(this);
        this.updateInput = this.updateInput.bind(this);
        this.updateChangeAuditReason = this.updateChangeAuditReason.bind(this);
        this.updatePersonInput = this.updatePersonInput.bind(this);
        this.addPerson = this.addPerson.bind(this);
        this.pullForwardPerson = this.pullForwardPerson.bind(this);
        this.pullReasonCode = this.pullReasonCode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFormSectionFilter = this.handleFormSectionFilter.bind(this);
        this.geoFindMe = this.geoFindMe.bind(this);
        this.geoSuccess2 = this.geoSuccess2.bind(this);
        this.geoSuccess = this.geoSuccess.bind(this);
        this.handleCodes = this.handleCodes.bind(this);
        this.validateDateTime = this.validateDateTime.bind(this);
        this.validateFormSection = this.validateFormSection.bind(this);
        //this.validateZipCode = this.validateZipCode.bind(this);
        this.toggleJson = this.toggleJson.bind(this);
        // tags (offense codes)
        this.handleCodeDelete = this.handleCodeDelete.bind(this);
        this.handleCodeAdd = this.handleCodeAdd.bind(this);
        this.handleFilterSuggestions = this.handleFilterSuggestions.bind(this);
        this.setStopInProgress = this.setStopInProgress.bind(this);
        this.cancelStopInProgress = this.cancelStopInProgress.bind(this);
        this.clearStore = this.clearStore.bind(this);
        //this.continueEdit = this.continueEdit.bind(this);
    }

    radioSelection(e, node, itemkey) {
        var val = e.target.value;
        var name = e.target.name;
        var newStop = this.state.stop;
        var newPerson = this.state.stop.Person_Stopped;

        //officerAssignment is not like the others, the json is diff
        if (name === "otherType") {
            newStop.officerAssignment = { key: 10, type: "Other", otherType: val }
        }
        else if (node === "officerAssignment") {
            newStop[node] = { key: itemkey, type: val, otherType: "" }
        }
        else if (node === "reasonForStop") {
            if (newPerson[node].reason != val) {
                newPerson[node] = { key: itemkey, reason: val, details: [{ reason: '', key: '' }], codes: [] }
            }
            if (val === 'Consensual Encounter resulting in a search') {
                var noneSelected = newPerson.actionsTakenDuringStop.map(function (x) { return x.action }).indexOf("None");
                if (noneSelected != -1) {
                    newPerson.actionsTakenDuringStop.splice(noneSelected, 1);
                }
            }
            else {
                var i = newPerson.actionsTakenDuringStop.map(function (x) { return x.action }).indexOf("Search of person was conducted");
                if (i > -1) {
                    newPerson.actionsTakenDuringStop.splice(i, 1);
                    newPerson.basisForSearch = [];
                    newPerson.basisForSearchBrief = "";
                }
                i = newPerson.actionsTakenDuringStop.map(function (x) { return x.action }).indexOf("Search of property was conducted");
                if (i > -1) {
                    newPerson.actionsTakenDuringStop.splice(i, 1);
                    newPerson.basisForSearch = [];
                    newPerson.basisForSearchBrief = "";
                }
            }
        }
        else if (node === "perceivedGender") {
            if (name === "Transgender man/boy" || name === "Transgender woman/girl") {
                newPerson.perceivedLgbt = 'Yes';
            } else {
                newPerson.perceivedLgbt = '';
            }
            newPerson[node] = val
            newPerson.Gend = itemkey
        }
        else if (node === "perceivedLgbt") {
            newPerson[node] = val
        }
        else if (node === "PerceptionKnown") {
            newPerson[node] = val
        }
        else {
            newStop[node] = val
        }
        newStop.Person_Stopped = newPerson;
        this.setState({ stop: newStop });
    }

    checkBoxSelection(e, node, node2, node2b, itemkey) {
        var val = e.target.value;
        var arr = this.state.stop.Person_Stopped[node].slice();
        var newPerson = this.state.stop.Person_Stopped;
        var i = arr.map(function (x) { return x[node2]; }).indexOf(val);

        if (i === -1) {
            if (node === 'actionsTakenDuringStop') {
                if (newPerson.reasonForStop.reason === 'Consensual Encounter resulting in a search') {
                    var noneSelected = newPerson.actionsTakenDuringStop.map(function (x) { return x.action }).indexOf("None");
                    if (noneSelected != -1) {
                        newPerson.actionsTakenDuringStop = [];
                        arr = [];
                    }
                }
                else if (val == 'None') {
                    arr = [];
                    newPerson.basisForSearch = [];
                    newPerson.basisForSearchBrief = '';
                    //newPerson.contrabandOrEvidenceDiscovered = [];
                    newPerson.basisForPropertySeizure = [];
                    newPerson.typeOfPropertySeized = [];
                }
                arr.push({
                    [node2]: val,
                    //[node2b]: [],
                    key: itemkey
                })
                // *** Uncomment these lines to comply with DOJ's rules and prevent getting Error Code RV289 ***

                //} else if (node === "basisForPropertySeizure")
                //{
                //    if (itemkey == 2 || itemkey == 3) {
                //        var noneSelected = newPerson.contrabandOrEvidenceDiscovered.map(function (x) { return x.contraband }).indexOf("None");
                //        if (noneSelected  != -1) {
                //            newPerson.contrabandOrEvidenceDiscovered = [];
                //        }
                //    }
                //    arr.push({ [node2]: val, key: itemkey });

            } else if (node === 'resultOfStop') {

                //this.checkBoxSelection(e, 'resultOfStop', 'result', '', 3
                //if (itemkey == 3) {
                //    arr.push({
                //        [node2]: val, codes: [{ code: "65002", text: "65002 ZZ - LOCAL ORDINANCE VIOL (I) 65002" }], key: itemkey });
                //} else {
                if (val == 'No Action') {
                    arr = []
                }
                if (val == 'Contacted U.S. Department of Homeland Security') {
                    alert('Are you sure you want to select "Contacted U.S. Department of Homeland Security"?')
                }
                arr.push({ [node2]: val, codes: [], key: itemkey });
                //}
            } else if (node2b) { //default nested
                arr.push({ [node2]: val, [node2b]: [], key: itemkey });
                //arr.push({ [node2]: val });
            } else { //default
                if (val == 'None') {
                    arr = []
                }
                arr.push({ [node2]: val, key: itemkey });
            }
            newPerson[node] = arr;
            this.setState({ Person_Stopped: newPerson });
        } else {
            if (val === 'Search of property was conducted' ||
                val === 'Search of person was conducted') {
                newPerson.basisForSearch = [];
                newPerson.basisForSearchBrief = "";
                newPerson.contrabandOrEvidenceDiscovered = [];
            }
            if (val === 'Property was seized') {
                newPerson.basisForPropertySeizure = [];
                newPerson.typeOfPropertySeized = [];
            }
            arr.splice(i, 1);
            newPerson[node] = arr;
            this.setState({ Person_Stopped: newPerson })
        }
    }
    radioNestedCheckBoxSelection(e, node, node2, node2b, itemkey) {
        var val = e.target.value;
        var arr = this.state.stop.Person_Stopped[node][node2b].slice();
        var newStop = this.state.stop.Person_Stopped;

        var i = arr.map(function (x) { return x[node2]; }).indexOf(val);

        if (i === -1) {
            if (node === 'reasonForStop') {
                if (arr.length == 1) {
                    if (arr[0].reason == '') {
                        arr = []
                    }
                }
                arr.push({ [node2]: val, key: itemkey })
            } else {
                arr.push({ [node2]: val, key: itemkey });
            }
            newStop[node][node2b] = arr;
            this.setState({ Person_Stopped: newStop });
        } else {
            arr.splice(i, 1);
            newStop[node][node2b] = arr;
            this.setState({ Person_Stopped: newStop })
        }
    }
    radioNestedRadioSelection(e, node, itemkey, node2, node2b) {
        var val = e.target.value;
        var arr = this.state.stop.Person_Stopped[node][node2b].slice();
        var newStop = this.state.stop.Person_Stopped;

        var i = arr.map(function (x) { return x[node2]; }).indexOf(val);

        if (i === -1) {
            if (node === 'reasonForStop') {
                arr[0] = { [node2]: val, key: itemkey }
            } else {
                arr[0] = { [node2]: val, key: itemkey }
            }
            newStop[node][node2b] = arr;
            this.setState({ Person_Stopped: newStop });
        } else {
            arr.splice(i, 1);
            newStop[node][node2b] = arr;
            this.setState({ Person_Stopped: newStop })
        }
    }
    searchConsentGiven(e) {
        var val = e.target.value;
        var arr = this.state.stop.Person_Stopped.actionsTakenDuringStop.slice();
        var newStop = this.state.stop.Person_Stopped;

        if (val === 'Property Search Consent Given') {
            val = e.target.checked ? true : false;
            var i = arr.map(function (x) { return x.action; }).indexOf('Asked for consent to search property');
            arr[i].propertySearchConsentGiven = val;
            arr[i].key = val ? '19,Y' : '19,N';
            newStop.actionsTakenDuringStop = arr;
        }
        else if (val === 'Person Search Consent Given') {
            val = e.target.checked ? true : false;
            var i = arr.map(function (x) { return x.action; }).indexOf('Asked for consent to search person');
            arr[i].key = val ? '17,Y' : '17,N';
            arr[i].personSearchConsentGiven = val;
            newStop.actionsTakenDuringStop = arr;
        }
        this.setState({ Person_Stopped: newStop });
    }
    handleBlockChange(event) {
        var newStop = this.state.stop;
        var newLocation = this.state.stop.location;
        newLocation.blockNumber = event.target.value;
        this.setState({ stop: newStop });
    }

    updateLocation(e, type) {
        var newStop = this.state.stop;

        var newLocation = this.state.stop.location;
        var newblockNumber = this.state.stop.location.blockNumber;
        var newStreetName = this.state.stop.location.streetName;
        var newCity = this.state.stop.location.city;
        var newBeat = this.state.stop.location.beat;


        if (e.address && type == 'address') {// update location from reverse geocoder
            var streetNum = e.address.Street.substr(0, e.address.Street.indexOf(' '));
            if (isNaN(streetNum)) {
                newblockNumber = '';
                newStreetName = e.address.Street;
            }
            else {
                newblockNumber = this.floorInteger(streetNum);
                newStreetName = e.address.Street.substr(e.address.Street.indexOf(' ') + 1);
            }

            // check if e.address.City is in this.state.codes.cities 
            var city = "";
            if (this.state.codes.CountyCities.includes(e.address.City) || this.state.codes.OutOfCountyCities.includes(e.address.City)) {
                city = e.address.City
            }

            if (city != 'CN' && city != "") {
                if (newCity.codes.length > 0) {
                    newCity.codes.pop();
                }
                newCity.codes.push({
                    code: city,
                    text: city
                });
                newStop.location.outOfCounty = false;
            } else {
                newCity = {
                    codes: []
                }
            }

            newStop.location.blockNumber = newblockNumber;
            newStop.location.streetName = newStreetName;
            newStop.location.city = newCity;

        } else if (e.address && type == 'beat') {// update location from reverse geocoder
            if (this.state.useBeats > 0) {

                var beat = e.address;

                // SH Custom to match beat layer info to lookup table.
                if (this.state.codes.Beats.includes(beat.AGENCY_DESC + ' ' + beat.SH_BEAT) ||
                    this.state.codes.Beats.includes(beat.NAME + ' ' + beat.SH_BEAT)) {

                    if (newBeat.codes.length > 0) {
                        newBeat.codes.pop();
                    }

                    if (beat.AGENCY == 'SH') {
                        newBeat.codes.push({
                            code: beat.SH_BEAT,
                            text: beat.NAME + ' ' + beat.SH_BEAT
                        });
                    } else {
                        newBeat.codes.push({
                            code: beat.SH_BEAT,
                            text: beat.AGENCY_DESC + ' ' + beat.SH_BEAT
                        });
                    }

                    newStop.location.beat = newBeat;
                }
            }
        }
        else if (e.error) {
            alert(e.error.details);
            console.log(e.error);
        }
        else {
            var val = e.target.value;
            var name = e.target.name;
            val && (name === 'streetName' || name === 'blockNumber') ? e.target.className = 'list-item' : null;
            newLocation[name] = val;

            if (val && name === 'blockNumber') {
                newLocation.blockNumber = isNaN(this.floorInteger(e.target.value)) ? '' : this.floorInteger(e.target.value);
            }
            newStop.location = newLocation;
        }

        localStorage.setItem('LastLocation', JSON.stringify(newStop.location));
        this.setState({ stop: newStop });
        //alert(JSON.stringify(store.get('LastLocation')));
    }
    useLastLocation(e) {
        var newStop = this.state.stop;
        //var newLocation = store.get('LastLocation');    
        var newLocation = JSON.parse(localStorage.getItem('LastLocation'));
        if (newLocation) {
            newStop.location = newLocation;
            this.setState({ stop: newStop });
        } else {
            alert('No location saved yet. ')
        }
        e.preventDefault()
    }
    updateInput(e) {
        var val = e.target.value;
        var newStop = this.state.stop;
        var name = e.target.name;
        if (name == "ExpYears") {
            val = Math.round(val);
        }
        newStop[name] = val;
        this.setState({ stop: newStop });
    }

    updateChangeAuditReason(e) {
        var val = e.target.value;
        var newchangeAuditReason = this.state.changeAuditReason;

        newchangeAuditReason = val;
        this.setState({ changeAuditReason: newchangeAuditReason });
    }
    updatePersonInput(e) {
        var val = e.target.value;
        var newStop = this.state.stop.Person_Stopped;
        var name = e.target.name;
        if (name == "perceivedAge") {
            val = Math.round(val);
        }
        newStop[name] = val;
        this.setState({ Person_Stopped: newStop });
    }
    updateBoolCheckBox(e, node, node2) {
        var val = e.target.checked ? true : false;
        var newStop = this.state.stop;
        if (node2) {
            newStop[node][node2] = val;
            if (node2 == 'genderNonconforming' && val == true) {
                newStop[node].gendNC = 5;
            }
            if (node2 == 'genderNonconforming' && val == false) {
                newStop[node].gendNC = '';
            }
            if (node2 == 'school' && val == false) {
                newStop[node].schoolName = {
                    codes: []
                };
            }
            if (node2 == 'outOfCounty') {
                newStop[node].city = {
                    codes: []
                };
                if (this.state.useBeats > 0) {
                    if (val == true) {
                        newStop[node].beat = {
                            codes: [{
                                code: '999',
                                text: 'OUT OF COUNTY 999'
                            }]
                        };
                    } else if (val == false) {
                        newStop[node].beat = {
                            codes: []
                        };
                    }
                }
            }
        } else if (node == 'contractFundedPosition') {
            newStop[node] = val;
            if (val == false) {
                newStop.contractCity = {
                    codes: []
                };
            }
        } else {
            newStop[node] = val;
        }

        this.setState({ stop: newStop });
    }

    updateDateTime(e) {
        var val = e.target.value;
        var name = e.target.name;
        !val ? e.target.className += ' input-error' : null;

        switch (name) {
            case 'date':
                if (moment(val).isAfter() || !this.validateDate(val)) {
                    e.target.className += ' input-error'
                } else { e.target.className = 'list-item' }
                break;
            case 'time':
                if (moment(this.state.stop.date + ' ' + val).isAfter() || !this.validateTime(val)) {
                    e.target.className += ' input-error'
                } else { e.target.className = 'list-item' }
                break;
            case 'stopDuration':
                val = Math.round(val);
                if (!this.validateDuration(val)) {
                    e.target.className += ' input-error'
                } else { e.target.className = 'list-item' }
                break;
        }

        var newStop = this.state.stop;
        newStop[name] = val;
        this.setState({ stop: newStop });
        this.validateDateTime();
    }

    floorInteger(n) {
        //var len = n.length - 2;
        //var order = Math.pow(10, len);
        //var block = Math.floor(n / order); 
        //return block * order;

        if (n.length >= 3) {
            n = n - (n % 100)
        }
        else {
            n = 0
        };
        return n;

    }

    geoSuccess(position) {
        this.geoReverseGeocode(position.coords.longitude, position.coords.latitude);
        this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        //alert("Position recorded.");
    }
    geoSuccess2(position) {
        this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        //alert("Position recorded.");
    }

    geoFindMe(e, RevGeo) {
        if (!navigator.geolocation) {
            console.log("Geolocation is not supported by your browser");
            alert("Geolocation is not supported by your browser");
            return;
        }
        function error(e) {
            console.log("PositionError: " + e.code + " - " + e.message);
            alert("PositionError: " + e.code + " - " + e.message);
        }
        e.preventDefault();

        if (RevGeo) {
            navigator.geolocation.getCurrentPosition(this.geoSuccess, error);
        } else {
            navigator.geolocation.getCurrentPosition(this.geoSuccess2, error);
        }
        //navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
        //    alert("Geolocation API permissions status: " + result.state);
        //});       
    }
    geoReverseGeocode(x, y) {
        var thiss = this;
        //Reverse geocode the address
        var uri = this.state.reverseGeoURI + '' + x + ',' + y + '&outSR=4326';
        fetch(uri)
            .then(function (response) {
                return response.json()
                    .then(function (json) {
                        console.log(json)
                        thiss.updateLocation(json, 'address');
                        return json;
                    }).catch(function (error) {
                        console.log('There has been a problem with your address fetch operation: ' + error.message);
                        throw error;
                    });
            });
        //Reverse geocode the beat
        if (this.state.useBeats > 0) {
            uri = this.state.reverseBeatURI + '' + x + ',' + y + '&outSR=4326';
            fetch(uri)
                .then(function (response) {
                    return response.json()
                        .then(function (json) {
                            console.log(json)
                            thiss.updateLocation(json, 'beat');
                            return json;
                        }).catch(function (error) {
                            console.log('There has been a problem with your beat fetch operation: ' + error.message);
                            throw error;
                        });
                });
        }
    }

    addPerson(e) {
        if (confirm("Add additional person?")) {
            var newStop = this.state.stop;
            //var person = this.state.stop.Person_Stopped;
            var count = this.state.personCount;

            //newStop.ListPerson_Stopped.push(person);
            newStop.Person_Stopped = {
                PID: count + 1,
                Is_Stud: '',
                //Perc: {
                perceivedRace: [],
                perceivedLimitedEnglish: false,
                perceivedOrKnownDisability: [],
                perceivedAge: '',
                perceivedGender: '',
                Gend: '',
                genderNonconforming: false,
                gendNC: '',
                perceivedLgbt: '',
                //}
                reasonForStop: '',
                reasonForStopExplanation: '',
                actionsTakenDuringStop: [],
                contrabandOrEvidenceDiscovered: [],
                basisForSearch: [],
                basisForSearchBrief: '',
                basisForPropertySeizure: [],
                typeOfPropertySeized: [],
                resultOfStop: []
            }

            var instrumentation = this.state.instrumentation;
            var lastend = instrumentation.temporalTrace.stepTrace[
                instrumentation.temporalTrace.stepTrace.length - 1
            ].endTimeStamp;
            instrumentation.temporalTrace.stepTrace.push(
                { formPartFilter: '5', startTimeStamp: lastend, endTimeStamp: moment().format('YYYY-MM-DD HH:mm:ss') }
            );

            count++;
            this.setState({ stop: newStop, formPartFilter: '2', progress: 31, instrumentation: instrumentation, personCount: count });
            scroll(0, 0);
        }
        e.preventDefault();
    }
    pullForwardPerson(e) {
        if (this.state.stop.ListPerson_Stopped.length > 0) {

            var lastPerson = this.state.stop.ListPerson_Stopped[0];
            var newStop = this.state.stop;
            var newPerson = this.state.stop.Person_Stopped;

            //disable pulling forward students since students have downstream options that are only available with the student selection in previous step.
            if (lastPerson.Is_Stud) {
                alert('Cannot pull forward students.');
                return;
            }

            newPerson.reasonForStop = lastPerson.reasonForStop;
            newPerson.reasonForStopExplanation = lastPerson.reasonForStopExplanation;
            newPerson.actionsTakenDuringStop = lastPerson.actionsTakenDuringStop;
            newPerson.contrabandOrEvidenceDiscovered = lastPerson.contrabandOrEvidenceDiscovered;
            newPerson.basisForSearch = lastPerson.basisForSearch;
            newPerson.basisForSearchBrief = lastPerson.basisForSearchBrief;
            newPerson.basisForPropertySeizure = lastPerson.basisForPropertySeizure;
            newPerson.typeOfPropertySeized = lastPerson.typeOfPropertySeized;
            newPerson.resultOfStop = lastPerson.resultOfStop;

            newStop.Person_Stopped = newPerson;
            this.setState({ stop: newStop });
        }
        e.preventDefault();
    }

    pullReasonCode(e, node, type, node2, node3, node3v) {
        var instrumentation = this.state.instrumentation;

        if (this.state.stop.Person_Stopped.reasonForStop.codes.length > 0) {
            var reason = this.state.stop.Person_Stopped.reasonForStop.codes[0].text;
            this.handleCodeAdd(reason, node, type, node2, node3, node3v)
            instrumentation.pullFromReasonCode = true;
            this.setState({ instrumentation: instrumentation });
        }
        // Prevents the page from refreshing
        e.preventDefault();
    }
    handleSubmit(e) {
        //this.geoFindMe(e);
        var _fetchURL;
        var _method;
        var thiss = this;
        this.validateFormSection();

        if (!this.state.validationErrorMsg.errorFlag) {

            // show loader button
            thiss.setState({ loader: true })

            fetch("/", { //Test Network first before sumbitting
                method: 'get',
                credentials: "same-origin"
            }).then(function (response) {
                if (!response.ok) {
                    alert('You are offline.')
                    console.log("offline");
                } else {
                    //alert('You are online.')
                    console.log("online");
                }
            }).then(function (response) {
                console.log("ok");

                var instrumentation = thiss.state.instrumentation;
                var lastend = instrumentation.temporalTrace.stepTrace[
                    instrumentation.temporalTrace.stepTrace.length - 1
                ].endTimeStamp;
                instrumentation.temporalTrace.stepTrace.push(
                    { formPartFilter: '5', startTimeStamp: lastend, endTimeStamp: moment().format('YYYY-MM-DD HH:mm:ss') }
                );
                const editStop = document.getElementById('editStop').innerHTML;
                var submissionEdit = document.getElementById('submissionEdit').innerText;
                var postSubRedact = document.getElementById('postSubRedact').innerText;
                if (editStop == 1) {
                    const stopid = document.getElementById('stopid').innerHTML;
                    _fetchURL = '/api/StopsAPI?' + thiss.state.stop + '&stopId=' + stopid + '&changeAuditReason=' + thiss.state.changeAuditReason + '&submissionEdit=' + submissionEdit + '&postSubRedact=' + postSubRedact;
                    _method = 'PUT';
                }
                else {
                    _fetchURL = '/stops/create';
                    _method = 'post';
                }


                fetch(_fetchURL, {
                    method: _method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body:
                        JSON.stringify({
                            JsonStop: JSON.stringify(thiss.state.stop),
                            JsonInstrumentation: JSON.stringify(instrumentation),
                            Latitude: thiss.state.latitude,
                            Longitude: thiss.state.longitude,
                            Beat: thiss.state.beat,
                            PersonCount: thiss.state.personCount
                        }),
                    credentials: "same-origin"
                }).then(function (response) {
                    if (!response.ok) {
                        thiss.setState({ loader: false })
                        throw Error(response.statusText);
                    }
                    return response
                }).then(function (data) {
                    console.log(data);
                    var progress = thiss.state.progress;
                    progress = progress < 100 ? progress += 18 : progress;
                    var instrumentation = thiss.state.instrumentation;
                    instrumentation.temporalTrace.stepTrace = [];
                    //store.remove('stopInProgress');
                    thiss.setState({ formPartFilter: '6', progress: progress, instrumentation: instrumentation });
                }).catch(function (error) {
                    thiss.setState({ loader: false })
                    if (error.message == 'Conflict') {
                        error.message += '. This Stop has already posted. Please cancel to start a new Stop.'
                    }
                    alert('There has been a problem with your submission: ' + error.message);
                    throw error;

                });

            }).catch(function (error) {
                thiss.state.loader = false;
                console.log(error);
            });

        }
        e.preventDefault();
    }

    //continueEdit(e) {
    //    var url;
    //    url = "/StopsSubmission/SubmissionStats?sid=" + document.getElementById('submissionID').innerText + "&endDate=" + document.getElementById('submissionEndDate').innerText
    //    fetch(url, {
    //        method: 'POST'
    //    });
    //}

    handleFormSectionFilter(e, templatename, includeLocation) {
        var editStop;
        editStop = document.getElementById('editStop').innerHTML;

        if (this.state.formPartFilter > e.target.name) {
            console.log('going backwards');
        } else {
            this.validateFormSection();
        }


        if (!this.state.validationErrorMsg.errorFlag) {
            var val = e.target.name;
            var dir = e.target.title;
            var progress = this.state.progress;
            var step = this.state.formPartFilter

            if (editStop == 0) {
                if (val == 2 && this.state.useBeats > 0 && dir !== '<< Back') {
                    if (this.state.stop.location.beat.codes.length == 0) {
                        //if (!confirm('You selected beat ' + this.state.stop.location.beat.codes[0].text + '. Proceed with this beat?')) {
                        e.preventDefault();
                        return;
                        //}
                    }
                }
            }

            if (dir === '<< Back') {
                if (step == 5 && progress == 100) {
                    progress -= 23;
                }
                else {
                    progress = progress > 9 ? progress -= 23 : progress;
                }
            } else if (dir != "Start") {
                progress = progress < 100 ? progress += 23 : progress;
            }



            if (val == 5) { //last step - review
                var newStop = this.state.stop;
                var person = this.state.stop.Person_Stopped;
                if (editStop == 1) {
                    const pid = document.getElementById('pid').innerHTML - 1;
                    newStop.ListPerson_Stopped.splice(pid, 1, person);
                }
                else {
                    newStop.ListPerson_Stopped.push(person);
                }
                newStop.Person_Stopped = {};
                this.setState({ stop: newStop });
            }
            if (val == 4 && dir == '<< Back') { //step back from review
                var newStop = this.state.stop;
                if (editStop == 1) {
                    const pid = document.getElementById('pid').innerHTML - 1;
                    var person = this.state.stop.ListPerson_Stopped[pid];

                    newStop.Person_Stopped = person;
                }
                else {
                    var ix = this.state.stop.ListPerson_Stopped.length - 1;
                    var person = this.state.stop.ListPerson_Stopped[ix];

                    newStop.ListPerson_Stopped.pop();
                    newStop.Person_Stopped = person;
                }

                this.setState({ stop: newStop });
            }

            var instrumentation = this.state.instrumentation;
            if (instrumentation.temporalTrace.stepTrace.length > 0) {
                var lastend = instrumentation.temporalTrace.stepTrace[
                    instrumentation.temporalTrace.stepTrace.length - 1
                ].endTimeStamp;
                instrumentation.temporalTrace.stepTrace.push(
                    { formPartFilter: step, startTimeStamp: lastend, endTimeStamp: moment().format('YYYY-MM-DD HH:mm:ss') }
                );
            } else {
                var lastend = instrumentation.temporalTrace.startTimeStamp;
                instrumentation.temporalTrace.stepTrace.push(
                    { formPartFilter: step, startTimeStamp: lastend, endTimeStamp: moment().format('YYYY-MM-DD HH:mm:ss') }
                );
            }
            var template = this.state.stop;
            if (templatename) {
                //if (store.get('LastLocation') && includeLocation) {
                if (localStorage.getItem('LastLocation') && includeLocation) {
                    //template.location = store.get('LastLocation');
                    template.location = JSON.parse(localStorage.getItem('LastLocation'));
                }
                template.Person_Stopped = this.state.templates[templatename].Person_Stopped;
                instrumentation.template = templatename;
            }

            if (editStop == 0) {
                // if to check if LatLong exist
                //if (!this.state.latitude) {
                this.geoFindMe(e, false);
            }
            //}
            this.setState({ formPartFilter: val, stop: template, progress: progress, instrumentation: instrumentation });

            scroll(0, 0);
        }
        //this.setStopInProgress();
        e.preventDefault();
    }
    //validateZipCode(zip) {
    //    return  /^\d{5}(?:[-\s]\d{4})?$/.test(zip);
    //}
    validateAge(age) {
        if (age) {
            return age <= 120 && age > 0 ? true : false;
        } else { return false; }
    }
    validateDuration(duration) {
        if (duration) {
            return duration <= 1440 && duration > 0 ? true : false;
        } else { return false; }
    }
    //validateDate(date) {
    //    return /^(19|20)?[0-9]{2}[-](0?[1-9]|1[012])[-](0?[1-9]|[12][0-9]|3[01])$/.test(date);
    //}

    validateDate(date) {
        var stop = this.state.stop;
        var alteredDate = '';
        //var dateformat = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
        var dateformat = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
        // Match the date format through regular expression
        if (date.match(dateformat)) {
            //document.form1.text1.focus();

            // If '/' is used convert '/' or '-' 
            alteredDate = date.replace(/\//g, "-");
            stop.date = alteredDate;
            this.setState({ stop: stop });
            var opera = alteredDate.split('-');
            lopera = opera.length;
            // Extract the string into month, date and year

            if (lopera > 1) {
                var pdate = alteredDate.split('-');
            }
            var yy = parseInt(pdate[0]);
            var mm = parseInt(pdate[1]);
            var dd = parseInt(pdate[2]);
            // Create list of days of a month [assume there is no leap year by default]
            var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (mm == 1 || mm > 2) {
                if (dd > ListofDays[mm - 1]) {
                    //alert('Invalid date format!');
                    return false;
                }
            }
            if (mm == 2) {
                var lyear = false;
                if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                    lyear = true;
                }
                if ((lyear == false) && (dd >= 29)) {
                    alert('Not a leap year!');
                    return false;
                }
                if ((lyear == true) && (dd > 29)) {
                    alert('leap year but day is wrong!');
                    return false;
                }
            }
            return true;
        }
        else {
            //alert("Invalid date format!");
            //document.form1.text1.focus();
            return false;
        }
    }

    validateTime(time) {
        return /^(([01][0-9]|2[0-3])[:][0-5][0-9]([:][0-5][0-9])?)$/.test(time);
    }
    validateDateTime() {
        var msg = this.state.validationErrorMsg;
        var editStop = document.getElementById('editStop').innerHTML;

        if (!this.validateDate(this.state.stop.date)) {
            msg.datetime = '*Please enter a valid date'
            msg.errorFlag = true;
        } else { msg.datetime = '' }
        if (!this.validateTime(this.state.stop.time)) {
            msg.time = '*Please enter a valid time'
            msg.errorFlag = true;
        } else { msg.time = '' }
        if (this.validateDate(this.state.stop.date) && this.validateTime(this.state.stop.time)) {
            var dateTime = this.state.stop.date + ' ' + this.state.stop.time;
            var yesterday = moment().subtract(this.state.allowedBackDateHours, 'hours');
            if (moment(dateTime, 'YYYY-MM-DD HH:mm').isAfter()) {
                msg.datetime = '*Please enter a date & time in the past'
                msg.errorFlag = true;
            }
            else
                if (editStop == 0) {
                    if (moment(dateTime, 'YYYY-MM-DD HH:mm').isBefore(yesterday)) {
                        msg.datetime = '*Please enter a date & time within the past ' + this.state.allowedBackDateHours + ' hrs'
                        msg.errorFlag = true;
                    }
                } else {
                    msg.datetime = '';
                }

        }
        this.setState({ validationErrorMsg: msg });
    }
    validateFormSection() {
        var step = this.state.formPartFilter;
        var msg = this.state.validationErrorMsg;
        var stop = this.state.stop;
        switch (step) {
            case '1':

                this.validateDateTime();
                if (!this.validateDuration(this.state.stop.stopDuration)) {
                    msg.duration = '*Please enter a valid Duration of Stop in minutes'
                    msg.errorFlag = true;
                } else { msg.duration = ''; }

                if ((!this.state.stop.location.streetName || !this.state.stop.location.blockNumber) && !this.state.stop.location.intersection && !this.state.stop.location.highwayExit && !this.state.stop.location.landMark) {
                    msg.block = '*Please enter a Street Name and Block Number  - or - the closest intersection - or - highway and closest exit - or - road marker, landmark or other.'
                    msg.errorFlag = true;
                } else { msg.block = ''; }

                if (this.state.stop.location.streetName && this.state.stop.location.blockNumber) {
                    this.state.stop.location.intersection = '';
                    this.state.stop.location.highwayExit = ''
                    this.state.stop.location.landMark = ''
                }
                if ((!this.state.stop.location.streetName || !this.state.stop.location.blockNumber) && this.state.stop.location.intersection) {
                    this.state.stop.location.highwayExit = ''
                    this.state.stop.location.landMark = ''
                }
                if ((!this.state.stop.location.streetName || !this.state.stop.location.blockNumber) && this.state.stop.location.highwayExit) {
                    this.state.stop.location.intersection = ''
                    this.state.stop.location.landMark = ''
                }
                if ((!this.state.stop.location.streetName || !this.state.stop.location.blockNumber) && this.state.stop.location.landMark) {
                    this.state.stop.location.highwayExit = ''
                    this.state.stop.location.intersection = ''
                }

                var locationStr =
                    this.state.stop.location.blockNumber.toString().trim() +
                    this.state.stop.location.streetName.trim() +
                    this.state.stop.location.intersection.trim() +
                    this.state.stop.location.highwayExit.trim() +
                    this.state.stop.location.landMark.trim();
                if (locationStr.length < 5) {
                    msg.locationLength = '*Location of Stop must contain minimum of 5 characters'
                    msg.errorFlag = true;
                } else { msg.locationLength = ''; }

                if (this.state.stop.location.school && this.state.stop.location.schoolName.codes.length < 1) {
                    msg.school = '*Please enter a school name'
                    msg.errorFlag = true;
                } else { msg.school = ''; }

                if (this.state.stop.location.city.codes.length < 1) {
                    msg.city = '*Please enter a City'
                    msg.errorFlag = true;
                } else { msg.city = ''; }

                if (this.state.useBeats > 1) {
                    if (this.state.stop.location.beat.codes.length < 1) {
                        msg.beat = '*Please enter a Beat'
                        msg.errorFlag = true;
                    } else { msg.beat = ''; }
                }

                if (!this.state.stop.ExpYears) {
                    msg.years = 'Please make a selection for Officer Years Of Experience'
                    msg.errorFlag = true;
                } else { msg.years = '' }
                if (this.state.stop.officerAssignment.key == 0) {
                    msg.assignment = 'Please make a selection for Officer Assignment'
                    msg.errorFlag = true;
                } else if (!this.state.stop.officerAssignment.otherType && this.state.stop.officerAssignment.key == 10) {
                    msg.assignment = 'Please enter a description for other assignment type'
                    msg.errorFlag = true;
                } else if (this.state.stop.officerAssignment.key == 10 && this.state.stop.officerAssignment.otherType.length < 3) {
                    msg.assignment = 'Please enter at least 3 characters for other assignment description'
                    msg.errorFlag = true;
                } else if (this.state.stop.officerAssignment.key == 10 && this.state.stop.officerAssignment.otherType.length > 60) {
                    msg.assignment = 'The other assignment description exceeded the limit of 60 characters'
                    msg.errorFlag = true;
                } else { msg.assignment = '' }

                if (this.state.stop.contractFundedPosition) {
                    if (this.state.stop.contractCity.codes.length < 1) {
                        msg.ContractCity = '*Please enter a Contract City'
                        msg.errorFlag = true;
                    } else {
                        msg.ContractCity = '';
                    }
                } else {
                    msg.ContractCity = '';
                }

                if (this.state.useBeats > 1) {
                    this.validateDate(this.state.stop.date) &&
                        this.validateTime(this.state.stop.time) &&
                        this.validateDuration(this.state.stop.stopDuration) &&
                        ((this.state.stop.location.streetName &&
                            this.state.stop.location.blockNumber) ||
                            this.state.stop.location.intersection ||
                            this.state.stop.location.highwayExit ||
                            this.state.stop.location.landMark) &&
                        this.state.stop.location.city.codes.length == 1 &&
                        this.state.stop.location.beat.codes.length == 1 &&
                        !msg.locationLength &&
                        !msg.school &&
                        !msg.assignment &&
                        !msg.years &&
                        !msg.ContractCity &&
                        !msg.datetime
                        ? msg.errorFlag = false : null;
                    msg.ContractCity ? msg.errorFlag = true : null;
                } else {
                    this.validateDate(this.state.stop.date) &&
                        this.validateTime(this.state.stop.time) &&
                        this.validateDuration(this.state.stop.stopDuration) &&
                        ((this.state.stop.location.streetName &&
                            this.state.stop.location.blockNumber) ||
                            this.state.stop.location.intersection ||
                            this.state.stop.location.highwayExit ||
                            this.state.stop.location.landMark) &&
                        this.state.stop.location.city.codes.length == 1 &&
                        !msg.locationLength &&
                        !msg.school &&
                        !msg.assignment &&
                        !msg.years &&
                        !msg.datetime
                        ? msg.errorFlag = false : null;
                    msg.ContractCity ? msg.errorFlag = true : null;
                }

                break;
            case '2':
                if (!this.state.stop.Person_Stopped.perceivedGender && !this.state.stop.Person_Stopped.genderNonconforming) {
                    msg.gender = '*Please make a selection for Perceived Gender'
                    msg.errorFlag = true;
                } else { msg.gender = ''; }
                if (this.state.stop.Person_Stopped.perceivedRace.length < 1) {
                    msg.race = '*Please make a selection for Perceived Race'
                    msg.errorFlag = true;
                } else { msg.race = ''; }
                if (!this.state.stop.Person_Stopped.perceivedLgbt) {
                    msg.lgbt = '*Please make a selection for Perceived LGBT'
                    msg.errorFlag = true;
                } else { msg.lgbt = ''; }
                if (!this.validateAge(this.state.stop.Person_Stopped.perceivedAge)) {
                    msg.age = '*Please enter a valid Perceived Age'
                    msg.errorFlag = true;
                } else { msg.age = ''; }
                if (this.state.stop.Person_Stopped.perceivedOrKnownDisability.length < 1) {
                    msg.disability = '*Please make a selection for Perceived Or Known Disability'
                    msg.errorFlag = true;
                } else { msg.disability = ''; }
                if (this.state.useAdditionalQuestions === "1") {
                    if (!this.state.stop.Person_Stopped.PerceptionKnown) {
                        msg.PerceptionKnown = '*Please make a selection for When the Perception was Formed.'
                        msg.errorFlag = true;
                    } else { msg.PerceptionKnown = ''; }
                }
                else { msg.disability = ''; }
                if (this.state.useAdditionalQuestions === "1") {
                    (this.state.stop.Person_Stopped.perceivedGender || this.state.stop.Person_Stopped.genderNonconforming) &&
                        this.state.stop.Person_Stopped.perceivedRace.length > 0 &&
                        this.state.stop.Person_Stopped.perceivedLgbt &&
                        this.validateAge(this.state.stop.Person_Stopped.perceivedAge) &&
                        this.state.stop.Person_Stopped.PerceptionKnown &&
                        this.state.stop.Person_Stopped.perceivedOrKnownDisability.length > 0 ? msg.errorFlag = false : null;
                }
                else {
                    (this.state.stop.Person_Stopped.perceivedGender || this.state.stop.Person_Stopped.genderNonconforming) &&
                        this.state.stop.Person_Stopped.perceivedRace.length > 0 &&
                        this.state.stop.Person_Stopped.perceivedLgbt &&
                        this.validateAge(this.state.stop.Person_Stopped.perceivedAge) &&
                        this.state.stop.Person_Stopped.perceivedOrKnownDisability.length > 0 ? msg.errorFlag = false : null;
                }
                break;
            case '3':
                if (!this.state.stop.Person_Stopped.reasonForStop.reason) {
                    msg.reason = '*Please make a selection for Reasons for Stop'
                    msg.errorFlag = true;
                } else {
                    msg.action = '';
                    if (this.state.stop.Person_Stopped.reasonForStop.reason == "Consensual Encounter resulting in a search" &&
                        (this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf('Search of person was conducted') == -1 && this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf('Search of property was conducted') == -1)) {
                        //stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { x.action = ""; })
                        msg.action = "*Please indicate whether search of a person or a property was conducted."
                        msg.errorFlag = true;
                    }
                    if (this.state.stop.Person_Stopped.reasonForStop.reason == "Traffic Violation") {
                        if (this.state.stop.Person_Stopped.reasonForStop.details.length < 1 || !this.state.stop.Person_Stopped.reasonForStop.details[0].reason) {
                            msg.trafficViolation = '*Please make a selection for Traffic Violation'
                            msg.errorFlag = true;
                        } else if (this.state.stop.Person_Stopped.reasonForStop.codes.length < 1) {
                            msg.trafficViolation = '*Please add a Vehicle Code section'
                            msg.errorFlag = true;
                        } else { msg.eduDiscipline = '', msg.reasonableSuspicion = '', msg.trafficViolation = '' }
                    }
                    if (this.state.stop.Person_Stopped.reasonForStop.reason == "Reasonable Suspicion") {
                        if (this.state.stop.Person_Stopped.reasonForStop.details.length < 1 || !this.state.stop.Person_Stopped.reasonForStop.details[0].reason) {
                            msg.reasonableSuspicion = '*Please make a selection for Reasonable Suspicion'
                            msg.errorFlag = true;
                        } else if (this.state.stop.Person_Stopped.reasonForStop.codes.length < 1) {
                            msg.reasonableSuspicion = '*Please add a Penal Code section'
                            msg.errorFlag = true;
                        } else { msg.eduDiscipline = '', msg.reasonableSuspicion = '', msg.trafficViolation = '' }
                    }
                    if (this.state.stop.Person_Stopped.reasonForStop.key == 7) { //education code
                        if (this.state.stop.Person_Stopped.reasonForStop.details.length < 1 || !this.state.stop.Person_Stopped.reasonForStop.details[0].reason) {
                            msg.eduDiscipline = '*Please make a selection for Possible conduct warranting discipline..'
                            msg.errorFlag = true;
                        } else if (this.state.stop.Person_Stopped.reasonForStop.details[0].key == 1 && this.state.stop.Person_Stopped.reasonForStop.codes.length < 1) {
                            msg.eduDiscipline = '*Please add a 48900 Sub Code section'
                            msg.errorFlag = true;
                        } else { msg.eduDiscipline = '', msg.reasonableSuspicion = '', msg.trafficViolation = '' }
                    }

                }
                if (this.state.stop.Person_Stopped.reasonForStopExplanation.trim().length < 5 || this.state.stop.Person_Stopped.reasonForStopExplanation.trim().length > 250) {
                    msg.reasonBrief = '*Please provide a brief explanation regarding the reason for the stop (at least 5 and less than 250 characters)'
                    msg.errorFlag = true;
                } else { msg.reasonBrief = '' }
                stop.Person_Stopped.reasonForStopExplanation = this.state.stop.Person_Stopped.reasonForStopExplanation.trim();

                this.state.stop.Person_Stopped.reasonForStop.reason &&
                    this.state.stop.Person_Stopped.reasonForStopExplanation &&
                    !msg.reasonableSuspicion &&
                    !msg.eduDiscipline &&
                    !msg.trafficViolation &&
                    !msg.reasonableSuspicion &&
                    !msg.action &&
                    !msg.reasonBrief ? msg.errorFlag = false : null;
                break;
            case '4':
                if (this.state.stop.Person_Stopped.actionsTakenDuringStop.length < 1) {
                    msg.action = '*Please make a selection for Actions Taken During Stop'
                    msg.errorFlag = true;
                } else {
                    msg.search = '';
                    if (this.state.stop.Person_Stopped.reasonForStop.reason == "Consensual Encounter resulting in a search" &&
                        (this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf('Search of person was conducted') == -1 && this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf('Search of property was conducted') == -1)) {
                        //stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { x.action = ""; })
                        msg.search = "*Please indicate whether search of a person or a property was conducted."
                        msg.errorFlag = true;
                    }

                    if (this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf('Search of person was conducted') > -1 || this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf('Search of property was conducted') > -1) {
                        if (this.state.stop.Person_Stopped.basisForSearch.length < 1) {
                            msg.searchBasis = '*Please make a selection for Basis for search'
                            msg.errorFlag = true;
                        }
                        else if (this.state.stop.Person_Stopped.basisForSearch.map(function (x) { return x.key; }).indexOf(4) == -1 || this.state.stop.Person_Stopped.basisForSearch.length > 1) {
                            if (this.state.stop.Person_Stopped.basisForSearchBrief.trim().length < 5 || this.state.stop.Person_Stopped.basisForSearchBrief.trim().length > 250) {
                                msg.searchBrief = '*Please provide a brief explanation regarding the reason for the stop (at least 5 and less than 250 characters)'
                                msg.errorFlag = true;
                            } else { msg.searchBrief = '' }
                            stop.Person_Stopped.basisForSearchBrief = this.state.stop.Person_Stopped.basisForSearchBrief.trim();

                            if (this.state.stop.Person_Stopped.basisForSearch.map(function (x) { return x.key; }).indexOf(1) > -1) {

                                if (this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.key; }).indexOf('17,N') > -1 ||
                                    this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.key; }).indexOf('19,N') > -1) {
                                    msg.searchBasis = '*"Basis for Search" indicates "Consent Given" but Person/Property search consent has not been selected'
                                    msg.errorFlag = true;
                                } else { msg.searchBasis = '' }
                            }
                            else {
                                if (this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.key; }).indexOf('17,Y') > -1 ||
                                    this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.key; }).indexOf('19,Y') > -1) {
                                    msg.searchBasis = '*If "Person/Property search consent" is given then "Consent Given" has to be selected'
                                    msg.errorFlag = true;
                                } else { msg.searchBasis = '' }
                            }
                        }

                        else {
                            msg.searchBrief = '';
                            msg.searchBasis = '';
                            stop.Person_Stopped.basisForSearchBrief = ''
                        }
                    }


                    if (this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf('Property was seized') > -1) {
                        if (this.state.stop.Person_Stopped.basisForPropertySeizure.length < 1) {
                            msg.seizureBasis = '*Please make a selection for Basis for property seizure'
                            msg.errorFlag = true;
                        } else { msg.seizureBasis = '' }
                        if (this.state.stop.Person_Stopped.typeOfPropertySeized.length < 1) {
                            msg.seizureProperty = '*Please make a selection for Type of property seized'
                            msg.errorFlag = true;
                        } else { msg.seizureProperty = '' }
                    }

                }


                if (this.state.stop.Person_Stopped.resultOfStop.length < 1) {
                    msg.result = '*Please make a selection for Result of Stop'
                    msg.errorFlag = true;
                } else {
                    msg.result = '';
                }

                if (this.state.stop.Person_Stopped.resultOfStop.length > 0) {
                    if (this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(2) > -1) {
                        if (this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(2)].codes.length < 1) {
                            msg.result = '*Please add Code section'
                            msg.errorFlag = true;
                        }
                    }
                    if (this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(3) > -1) {
                        if (this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(3)].codes.length < 1) {
                            msg.result = '*Please add Code section'
                            msg.errorFlag = true;
                        }
                    }
                    if (this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(4) > -1) {
                        if (this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(4)].codes.length < 1) {
                            msg.result = '*Please add Code section'
                            msg.errorFlag = true;
                        }
                    }
                    if (this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(6) > -1) {
                        if (this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(6)].codes.length < 1) {
                            msg.result = '*Please add Code section'
                            msg.errorFlag = true;
                        }
                    }
                }

                if (this.state.stop.Person_Stopped.contrabandOrEvidenceDiscovered.length < 1) {
                    msg.contraband = '*Please make a selection for Contraband or Evidence Discovered'
                    msg.errorFlag = true;
                } else {
                    // *** Uncomment these lines if you want validation be done for DOJ's Error Code RV289 ***

                    //if (this.state.stop.Person_Stopped.contrabandOrEvidenceDiscovered.map(function (x) { return x.contraband; }) == 'None' &&
                    //    (this.state.stop.Person_Stopped.basisForPropertySeizure.map(function (x) { return x.basis; }).indexOf('Contraband') > -1 ||
                    //        this.state.stop.Person_Stopped.basisForPropertySeizure.map(function (x) { return x.basis; }).indexOf('Evidence') > -1)) {
                    //    msg.contraband = "*Contraband or Evidence Discovered can not be 'None'"
                    //    stop.Person_Stopped.contrabandOrEvidenceDiscovered.map(function (x) { x.contraband = ""; })
                    //    msg.errorFlag = true;
                    //}
                    //else {
                    msg.contraband = '';
                }
                //}

                this.state.stop.Person_Stopped.actionsTakenDuringStop.length > 0 &&
                    this.state.stop.Person_Stopped.resultOfStop.length > 0 &&
                    this.state.stop.Person_Stopped.contrabandOrEvidenceDiscovered.length > 0 &&

                    !msg.searchBasis &&
                    !msg.seizureBasis &&
                    !msg.seizureProperty &&
                    !msg.searchBrief &&
                    !msg.result &&
                    !msg.action &&
                    !msg.search &&
                    !msg.contraband
                    ? msg.errorFlag = false : null;
                break;
            case '5':
                const editStop = document.getElementById('editStop').innerHTML;
                if (editStop == 1) {
                    if (this.state.changeAuditReason.trim().length < 5 || this.state.changeAuditReason.trim().length > 250) {
                        msg.changeAuditReason = '*Please provide a brief explanation regarding the reason for change (at least 5 and less than 250 characters)'
                        msg.errorFlag = true;
                    } else { msg.changeAuditReason = '' }
                    stop.changeAuditReason = this.state.changeAuditReason.trim();

                    msg.changeAuditReason == "" ? msg.errorFlag = false : null;
                }
                break;
        }
        this.setState({ validationErrorMsg: msg, stop: stop });

    }
    componentWillMount() {
        const editStop = document.getElementById('editStop').innerHTML;
        var editstop = this.state.editStop;
        if (editStop == 1) {
            const stopid = document.getElementById('stopid').innerHTML;
            this.fetchStop('/api/StopsAPI/', stopid);
            editstop = 1;
            this.setState({ editStop: editstop });
        }

        // if lookup cache update is forced
        var forceCacheUpdate = document.getElementById('forceCacheUpdate').innerHTML;
        if (forceCacheUpdate == 'true') {
            this.clearStore();
        }

        // if lookup cache is older than a certain age, expire it
        var lookupCacheDate = localStorage.getItem('lookupCacheDate');
        var expireCacheDays = document.getElementById('expireCacheDays').innerHTML;
        var limit = moment().subtract(expireCacheDays, 'days');
        if (moment(lookupCacheDate).isBefore(limit)) {
            this.clearStore();
            alert('Your cache has been refreshed.');
        }

        //Defer load?
        this.fetchCodes('/api/', 'CJISOffenseCodes', '', 'AllCodes');
        this.fetchCodes('/api/', 'Schools', '&type=San Diego', 'Schools');

        //load on mount
        //all out of county cities
        this.fetchCodes('/api/', 'Cities', '&county=SAN DIEGO&ooc=true', 'OutOfCountyCities');
        //local county cities
        this.fetchCodes('/api/', 'Cities', '&county=SAN DIEGO&ooc=false', 'CountyCities');



        //load education subdivisions
        var codenode = this.state.codes;
        codenode['EC'] = EC_Subdivision;
        this.setState({ codes: codenode });

        //store.set('test', this.state.codes.VC);       

    }
    fetchStop(uri, id) {
        var fetchURL = uri + id;
        var that = this;
        var newState = fetch(fetchURL, {
            method: 'get',
            credentials: "same-origin"
        }).then(function (response) {
            console.log(response)
            return response.json()
                .then(function (parsedJson) {
                    console.log(parsedJson)
                    that.updateState(parsedJson)
                })
                .catch(error => console.log('parsing failed', error));
        })
    }

    updateState(newState) {
        //var stops = this.state.stops.slice();
        var stop = JSON.parse(newState);
        const person = document.getElementById('pid').innerHTML;
        const pid = person - 1;

        //var listP = stop.ListPerson_Stopped.slice();
        //var personToAudit = listP[pid];
        var personToAudit = stop.ListPerson_Stopped[pid];
        stop.Person_Stopped = personToAudit;
        //this.setState({ stop: JSON.parse(stop), formPartFilter: '1' });
        this.setState({ stop: stop, progress: 8, formPartFilter: '1', personCount: person });
        console.log(this.state)
    }
    fetchCodes(uri, name, type, label) {
        var codenode = this.state.codes;
        //if (store.get(label)) {
        if (localStorage.getItem(label)) {
            //codenode[label] = store.get(label);
            codenode[label] = JSON.parse(localStorage.getItem(label));
            this.setState({ codes: codenode });
        } else {
            var thiss = this;
            var fetchedCodes = fetch(uri + name + '?fragment=' + type, {
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json()
                        .then(function (json) {
                            //console.log(json.map(function (x) { return x }))
                            if (name != 'Cities' && name != 'ContractCities') {
                                thiss.handleCodes(json.map(function (x) { return x.Description + ' ' + x.Code }), label);
                            } else {
                                thiss.handleCodes(json.map(function (x) { return x.Code }), label);
                            }
                            return json;
                        });
                })
                .catch(function (error) {
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    throw error;
                });
        }
        function error(e) {
            console.log("PC Code fetch Error: " + e.code + " - " + e.message);
            alert("PC Code fetch Error: " + e.code + " - " + e.message);
        }
    }
    clearStore() {
        //store.clearAll();
        //Storage.clear();
        localStorage.clear();
    }
    handleCodes(json, label) {
        var codenode = this.state.codes;
        var instrumentation = this.state.instrumentation;
        codenode[label] = json;

        localStorage.setItem(label, JSON.stringify(this.state.codes[label]));
        localStorage.setItem("lookupCacheDate", moment().format('YYYY-MM-DD HH:mm:ss')); //set cache creation date so it can be expired at some point

        instrumentation.lookupCacheDate = moment().format('YYYY-MM-DD HH:mm:ss');

        this.setState({ codes: codenode, instrumentation: instrumentation });
    }
    setStopInProgress() {
        localStorage.removeItem('stopInProgress');
        localStorage.setItem('stopInProgress', JSON.stringify({
            stop: this.state.stop,
            instrumentation: this.state.instrumentation,
            formPartFilter: this.state.formPartFilter,
            progress: this.state.progress,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            beat: this.state.beat,
            personCount: this.state.personCount
        }));
    }
    cancelStopInProgress(e) {
        if (confirm('Are you sure you want to cancel this Stop?')) {
            localStorage.removeItem('stopInProgress')
        }
    };
    // update stop progress cache with every update
    componentDidUpdate() {
        if (this.state.formPartFilter < '6' && this.state.formPartFilter > '0') {
            this.setStopInProgress();
        } else {
            localStorage.removeItem('stopInProgress')
        }
    };

    // first time a component mounts?
    componentDidMount() {

        var stop = this.state.stop;
        var formPartFilter = this.state.formPartFilter;
        var instrumentation = this.state.instrumentation;
        var progress = this.state.progress;
        var latitude = this.state.latitude;
        var longitude = this.state.longitude;
        var beat = this.state.beat;
        var submissionEdit = document.getElementById('submissionEdit').innerText;
        var personCount = this.state.personCount;

        if (localStorage.getItem('stopInProgress')) {
            var stopInProgress = JSON.parse(localStorage.getItem('stopInProgress'));
            var yesterday = moment().subtract(24, 'hours');
            // check age of stopInProgress 
            if (moment(stopInProgress.stop.date + ' ' + stopInProgress.stop.time, 'YYYY-MM-DD HH:mm').isAfter(yesterday)) {
                stop = stopInProgress.stop;
                instrumentation = stopInProgress.instrumentation;
                instrumentation.cacheFlag = true;
                instrumentation.server = document.getElementById('server').innerHTML;
                formPartFilter = stopInProgress.formPartFilter;
                progress = stopInProgress.progress;
                latitude = stopInProgress.latitude;
                longitude = stopInProgress.longitude;
                beat = stopInProgress.beat;
                personCount = stopInProgress.personCount;
                var userProfileUpdate = document.getElementById('userProfileUpdate').innerHTML;
                if (userProfileUpdate == "True") {
                    stop.ExpYears = document.getElementById('officerYearsExperience').innerHTML;
                    stop.officerAssignment.type = document.getElementById('officerAssignment').innerHTML;
                    stop.officerAssignment.key = document.getElementById('officerAssignmentKey').innerHTML;
                    stop.officerAssignment.otherType = document.getElementById('officerAssignmentOther').innerHTML;
                    stop.contractFundedPosition = document.getElementById('officerContractFundedPosition').innerHTML == "True" ? true : false;;

                    if (stop.contractFundedPosition) {
                        stop.contractCity.codes[0] = {
                            code: document.getElementById('officerContractCity').innerHTML,
                            text: document.getElementById('officerContractCity').innerHTML
                        }
                    } else {
                        stop.contractCity.codes = [];
                    }

                    stop.contractFundedEvent = document.getElementById('officerContractFundedEvent').innerHTML == "True" ? true : false;;
                    stop.contractEvent = document.getElementById('officerContractEvent').innerHTML;
                }
            } else {
                // delete stopInProgress
                localStorage.removeItem('stopInProgress')
                stop.date = moment().format('YYYY-MM-DD');
                stop.time = moment().format('HH:mm:ss');
                stop.ori = document.getElementById('ori').innerHTML;
                stop.agency = document.getElementById('agency').innerHTML;
                stop.officerID = document.getElementById('officerID').innerHTML;
                stop.ExpYears = document.getElementById('officerYearsExperience').innerHTML;
                stop.officerAssignment.type = document.getElementById('officerAssignment').innerHTML;
                stop.officerAssignment.key = document.getElementById('officerAssignmentKey').innerHTML;
                stop.officerAssignment.otherType = document.getElementById('officerAssignmentOther').innerHTML;
                stop.location.contractFundedPosition = document.getElementById('officerContractFundedPosition').innerHTML == "True" ? true : false;;

                if (stop.contractFundedPosition) {
                    stop.contractCity.codes[0] = {
                        code: document.getElementById('officerContractCity').innerHTML,
                        text: document.getElementById('officerContractCity').innerHTML
                    }
                }
                stop.contractFundedEvent = document.getElementById('officerContractFundedEvent').innerHTML == "True" ? true : false;;
                stop.contractEvent = document.getElementById('officerContractEvent').innerHTML;
                instrumentation.server = document.getElementById('server').innerHTML;
            }
        } else {
            stop.date = moment().format('YYYY-MM-DD');
            stop.time = moment().format('HH:mm:ss');
            stop.ori = document.getElementById('ori').innerHTML;
            stop.agency = document.getElementById('agency').innerHTML;
            stop.officerID = document.getElementById('officerID').innerHTML;
            stop.ExpYears = document.getElementById('officerYearsExperience').innerHTML;
            stop.officerAssignment.type = document.getElementById('officerAssignment').innerHTML;
            stop.officerAssignment.key = document.getElementById('officerAssignmentKey').innerHTML;
            stop.officerAssignment.otherType = document.getElementById('officerAssignmentOther').innerHTML;
            stop.contractFundedPosition = document.getElementById('officerContractFundedPosition').innerHTML == "True" ? true : false;
            if (stop.contractFundedPosition) {
                stop.contractCity.codes[0] = {
                    code: document.getElementById('officerContractCity').innerHTML,
                    text: document.getElementById('officerContractCity').innerHTML
                }
            }
            stop.contractFundedEvent = document.getElementById('officerContractFundedEvent').innerHTML == "True" ? true : false;;
            stop.contractEvent = document.getElementById('officerContractEvent').innerHTML;
            instrumentation.server = document.getElementById('server').innerHTML;
        }
        if (!localStorage.getItem('lookupCacheDate')) {
            localStorage.setItem('lookupCacheDate', moment().format('YYYY-MM-DD HH:mm:ss'));
        }
        instrumentation.lookupCacheDate = localStorage.getItem('lookupCacheDate');

        if (submissionEdit == 1) {
            this.setState({
                stop: stop,
                instrumentation: instrumentation,
                formPartFilter: formPartFilter,
                progress: progress,
                latitude: latitude,
                longitude: longitude,
                beat: beat,
                forceCacheUpdate: document.getElementById('forceCacheUpdate').innerHTML,
                allowedBackDateHours: document.getElementById('allowedBackDateHours').innerHTML,
                useBeats: document.getElementById('useBeats').innerHTML,
                useContractCity: document.getElementById('useContractCity').innerHTML,
                useContractEvent: document.getElementById('useContractEvent').innerHTML,
                debug: document.getElementById('debug').innerHTML,
                reverseGeoURI: document.getElementById('reverseGeoURI').innerText,
                reverseBeatURI: document.getElementById('reverseBeatURI').innerText,
                submissionEdit: submissionEdit,
                submissionID: "/StopsSubmission/SubmissionStatusGet?sid=" + document.getElementById('submissionID').innerText + "&endDate=" + document.getElementById('submissionEndDate').innerText,
                useAdditionalQuestions: document.getElementById('useAdditionalQuestions').innerHTML
            });
        } else {
            this.setState({
                stop: stop,
                instrumentation: instrumentation,
                formPartFilter: formPartFilter,
                progress: progress,
                latitude: latitude,
                longitude: longitude,
                beat: beat,
                personCount: personCount,
                forceCacheUpdate: document.getElementById('forceCacheUpdate').innerHTML,
                allowedBackDateHours: document.getElementById('allowedBackDateHours').innerHTML,
                useBeats: document.getElementById('useBeats').innerHTML,
                useContractCity: document.getElementById('useContractCity').innerHTML,
                useContractEvent: document.getElementById('useContractEvent').innerHTML,
                debug: document.getElementById('debug').innerHTML,
                reverseGeoURI: document.getElementById('reverseGeoURI').innerText,
                reverseBeatURI: document.getElementById('reverseBeatURI').innerText,
                submissionEdit: submissionEdit,
                useAdditionalQuestions: document.getElementById('useAdditionalQuestions').innerHTML
            });
        }


        if (document.getElementById('useBeats').innerHTML > 0) {
            this.fetchCodes('/api/', 'Beats', '', 'Beats');
        }

        if (document.getElementById('useContractCity').innerHTML > 0) {
            this.fetchCodes('/api/', 'ContractCities', '', 'ContractCities');
        }
    }

    toggleJson(e, node) {
        if (node) {
            var val = e.target.checked ? true : false;
            this.setState({ [node]: val });
        } else {
            var toggle = this.state.toggleJson ? false : true;
            this.setState({ toggleJson: toggle });
        }
    }

    handleCodeDelete(e, node, node2, node3, node3v) {
        //if (node) {
        //    var arr = this.state.stop.Person_Stopped[node][node2].slice();
        //} else {
        //    var arr = this.state.stop.Person_Stopped[node2].slice();
        //}

        if (node == 'schoolName' || node == 'city' || node == 'beat') {
            var arr = this.state.stop.location[node][node2].slice();
            arr.splice(e, 1);
        } else if (node == 'contractCity') {
            var arr = this.state.stop[node][node2].slice();
            arr.splice(e, 1);
        }
        else if (node == 'reasonForStop') {
            var arr = this.state.stop.Person_Stopped[node][node2];
            arr.splice(e, 1);
        } else {
            var arr = this.state.stop.Person_Stopped[node].slice();
            var i = arr.map(function (x) { return x[node3]; }).indexOf(node3v);
            arr[i]['codes'].splice(e, 1);
        }

        //get nested node (i.e. details)
        //var i = arr.map(function (x) { return x[node3]; }).indexOf(node3v);


        if (node == 'schoolName' || node == 'city' || node == 'beat') {
            var newStop = this.state.stop.location;
            newStop[node][node2] = arr;

            this.setState({ location: newStop });
            //if (!store.enabled) {
            //if (localStorage.storageAvailable()) {
            //    alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
            //    return
            //}
            //store.set('LastLocation', newStop);
            localStorage.setItem('LastLocation', JSON.stringify(newStop));
        } else if (node == 'contractCity') {
            var newStop = this.state.stop;
            newStop[node][node2] = arr;
            this.setState({ stop: newStop });
        }
        else if (node == 'reasonForStop') {
            var newStop = this.state.stop.Person_Stopped;
            newStop[node][node2] = arr;
            this.setState({ Person_Stopped: newStop });
        } else {
            var newStop = this.state.stop.Person_Stopped;
            newStop[node] = arr;
            this.setState({ Person_Stopped: newStop });
        }

        this.setState({ Person_Stopped: newStop });
    }

    handleCodeAdd(tag, node, type, node2, node3, node3v) {

        //get current node (i.e. reasonForStop)
        if (node == 'schoolName' || node == 'city' || node == 'beat') {
            var arr = this.state.stop.location[node];
            var ii = arr['codes'].map(function (x) { return x['text']; }).indexOf(tag);

        } else if (node == 'reasonForStop') {
            var arr = this.state.stop.Person_Stopped[node];
            var ii = arr['codes'].map(function (x) { return x['text']; }).indexOf(tag);

        } else if (node == 'contractCity') {
            var arr = this.state.stop[node];
            var ii = arr['codes'].map(function (x) { return x['text']; }).indexOf(tag);

        } else {
            var arr = this.state.stop.Person_Stopped[node2].slice();
            var i = arr.map(function (x) { return x[node3]; }).indexOf(node3v);
            var ii = arr[i]['codes'].map(function (x) { return x['text']; }).indexOf(tag); // for dupes    
        }

        //does the lookup value exist in the codes list?
        var codes = this.state.codes[type];
        var t = codes.map(function (x) { return x; }).indexOf(tag);

        // Does input match any of the existing codes
        if (t >= 0 && ii == -1) {
            if (node == 'reasonForStop' || node == 'schoolName' || node == 'beat') {
                if (arr['codes'].length < 1) {
                    arr['codes'].push({
                        code: tag.split(' ').pop(),
                        //text: tag.substr(0, tag.lastIndexOf(' '))
                        text: tag
                    });
                }
            } else if (node == 'city' || node == 'contractCity') {
                if (arr['codes'].length < 1) {
                    arr['codes'].push({
                        code: tag,
                        text: tag
                    });
                }
            } else {
                if (arr[i]['codes'].length < 5) {
                    arr[i]['codes'].push({
                        code: tag.split(' ').pop(),
                        text: tag
                    });
                }
            }

            if (node == 'schoolName' || node == 'city' || node == 'beat') {
                var newStop = this.state.stop.location;
                newStop[node] = arr;
                this.setState({ location: newStop });
                //if (!store.enabled) {
                //    alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
                //    return
                //}
                //store.set('LastLocation', newStop);
                var lastlocation = JSON.stringify(newStop);
                localStorage.setItem('LastLocation', lastlocation);

            } else if (node == 'reasonForStop') {
                var newStop = this.state.stop.Person_Stopped;
                newStop[node] = arr;
                this.setState({ Person_Stopped: newStop });
            } else if (node == 'contractCity') {
                var newStop = this.state.stop;
                newStop[node] = arr;
                this.setState({ Person_Stopped: newStop });
            } else {
                var newStop = this.state.stop.Person_Stopped;
                newStop[node2] = arr;
                this.setState({ Person_Stopped: newStop });
            }
        }
    }
    handleFilterSuggestions(textInputValue, possibleSuggestionsArray) {
        var lowerCaseQuery = textInputValue.toLowerCase()

        return possibleSuggestionsArray.filter(function (suggestion) {
            return suggestion.toLowerCase().includes(lowerCaseQuery)
        })
    }

    render() {
        return (
            <form >
                {this.state.forceCacheUpdate == 'true' &&
                    <div className="button-container">
                        <span className='required'>Caching is currently disabled due to lookup updates.</span>
                    </div>
                }
                {this.state.formPartFilter === "0" &&
                    <div className="list-section">
                        <h3>RIPA STOP APP</h3>
                        <h4>Initiate a new Stop:</h4>
                        <div className="button-menu-container">
                            <a href="" className="button-left" title="Start" name="1" onClick={(e) => this.handleFormSectionFilter(e, 'motor', true)} >Motor/Traffic Template</a>
                            <a href="" className="button-left" title="Start" name="1" onClick={(e) => this.handleFormSectionFilter(e, 'probation', true)} >Probation Contact Template</a>
                            <a href="" className="button-right" title="Start" name="1" onClick={(e) => this.handleFormSectionFilter(e)} >Default Template</a>
                        </div>
                        <h4>About this App:</h4>
                        <p>
                            The Racial and Identity Profiling Act of 2015 (AB 953) requires state and local law enforcement agencies, to collect data regarding stops of individuals, including perceived demographic information on the person stopped, and to report this data to the California Attorney General's (AG) Office.
                        </p>
                        <p>
                            The AG’s Office has adopted <a href="/regulation" target='_blank'>these regulations</a> on November 7, 2017. For more information please see the <a href='https://oag.ca.gov/ab953/regulations' target='_blank'> AG's Website</a>.
                        </p>
                        <div className="button-container">
                            <a href="" className="button-left button-cancel" title="" name="" onClick={this.clearStore} >
                                Refresh Cache
                        </a>
                        </div>
                        <div className="button-container">
                            <p><small>Cache Updated: {this.state.instrumentation.lookupCacheDate}</small></p> </div>
                    </div>
                }
                {this.state.formPartFilter === "1" &&
                    <div className="list-section">
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5
                        </p>

                        {/*this.state.validationErrorMsg.assignment && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.assignment}</div>*/}
                        <CheckBox2 key="Update Officer Information" className="list-item" checked={this.state.toggleOfficerOptions} value="Edit Assignment & Experience" name="Update Officer Information" onClick={(e) => this.toggleJson(e, 'toggleOfficerOptions')} />
                        {this.state.toggleOfficerOptions &&
                            <div>
                                <h3>Officer Years Of Experience </h3>
                                <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-15">§999.226(a)(15)</a>
                                {this.state.validationErrorMsg.years && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.years}</div>}
                                <TextInput type="number" min="0" max='60' pattern="\d*" stateValue={this.state.stop.ExpYears} name="ExpYears" className="list-item" label="Officer Years of Experience *" onChange={this.updateInput} />

                                <h3>Officer Assignment </h3>
                                <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-16">§999.226(a)(16)</a>
                                {this.state.validationErrorMsg.assignment && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.assignment}</div>}
                                <RadioButtonListSection stateValue={this.state.stop.officerAssignment.type} node='officerAssignment' itemList={officerAssignment} function={this.radioSelection} />
                                {this.state.stop.officerAssignment.type == "Other" &&
                                    <TextInput type="text" stateValue={this.state.stop.officerAssignment.otherType} node='officerAssignment' name="otherType" className="list-item-nested" label="Other Type:" onChange={this.radioSelection} />
                                }

                                {this.state.useContractCity > 0 &&
                                    <div>
                                        <h3>Contract Funded Position</h3>
                                        {this.state.validationErrorMsg.ContractCity && <div className="error-alert"> {this.state.validationErrorMsg.ContractCity}</div>}
                                        <CheckBox2 key="contract funded" className="list-item" checked={this.state.stop.contractFundedPosition} value="Position Contract Funded" name="contract funded" onClick={(e) => this.updateBoolCheckBox(e, 'contractFundedPosition')} />
                                        {this.state.stop.contractFundedPosition &&
                                            <div>
                                                <Tags tags={this.state.stop.contractCity.codes} className='list-item'
                                                    suggestions={this.state.codes.ContractCities}
                                                    autofocus={false}
                                                    allowDeleteFromEmptyInput={false}
                                                    placeholder='Add Contract City'
                                                    handleDelete={(e) => this.handleCodeDelete(e, 'contractCity', 'codes')}
                                                    handleAddition={(e) => this.handleCodeAdd(e, 'contractCity', 'ContractCities')} />
                                                <label className="list-item-nested"> Select 1 Contract City (required)</label>
                                            </div>}
                                    </div>
                                }
                                {this.state.useContractEvent > 0 &&
                                    <div>
                                        <h3>Contract Funded Event</h3>
                                        <CheckBox2 key="contract event" className="list-item" checked={this.state.stop.contractFundedEvent} value="Event Contract Funded" name="contract funded event" onClick={(e) => this.updateBoolCheckBox(e, 'contractFundedEvent')} />
                                    </div>
                                }    </div>
                        }

                        <h3>Date Of Stop</h3>
                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-2">§999.226(a)(2)</a>
                        {this.state.validationErrorMsg.datetime && <div className="error-alert"> {this.state.validationErrorMsg.datetime}</div>}
                        <TextInput type="date" max={this.state.instrumentation.temporalTrace.startDate} stateValue={this.state.stop.date} className="list-item" label="Date" name="date" onChange={this.updateDateTime} required />
                        {this.state.editStop == 1 &&
                            <div>{this.state.stop.date}</div>
                        }
                        {this.state.validationErrorMsg.time && <div className="error-alert"> {this.state.validationErrorMsg.time}</div>}
                        <TextInput type="time" max={this.state.instrumentation.temporalTrace.startTime} stateValue={this.state.stop.time} className="list-item" label="Time" name="time" onChange={this.updateDateTime} />


                        {this.state.validationErrorMsg.duration && <div className="error-alert"> {this.state.validationErrorMsg.duration}</div>}
                        <TextInput type="number" min='0' stateValue={this.state.stop.stopDuration} className="list-item" label="Duration of Stop (in Minutes, maximum 1440)" name="stopDuration" pattern="\d*" onChange={this.updateDateTime} />


                        {/*<h3>Stop in response to Call for Service </h3>
                        <a className="required regref" target="_blank" href="/regulation#999-226-a-11">§999.226(a)(11)</a>*/}
                        <CheckBox2 key="Stop in response to Call for Service" className="list-item" checked={this.state.stop.stopInResponseToCFS} value="Stop in response to Call for Service" name="Stop in response to Call for Service" onClick={(e) => this.updateBoolCheckBox(e, 'stopInResponseToCFS')} />

                        <h3>Location</h3>
                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-3">§999.226(a)(3)</a>
                        {this.state.validationErrorMsg.school && <div className="error-alert"> {this.state.validationErrorMsg.school}</div>}

                        <CheckBox2 key="school" className="list-item" checked={this.state.stop.location.school} value="K-12 Public School" name="School" onClick={(e) => this.updateBoolCheckBox(e, 'location', 'school')} />
                        {this.state.stop.location.school &&
                            <div>
                                {/*<TextInput type="text" stateValue={this.state.stop.location.schoolName} name="schoolName" className="list-item-nested" label="School Name:" onChange={this.updateLocation} /> */}

                                <Tags tags={this.state.stop.location.schoolName.codes}
                                    suggestions={this.state.codes.Schools}
                                    placeholder='Add School'
                                    handleDelete={(e) => this.handleCodeDelete(e, 'schoolName', 'codes')}
                                    handleAddition={(e) => this.handleCodeAdd(e, 'schoolName', 'Schools')}
                                    handleFilterSuggestions={this.handleFilterSuggestions}
                                />
                                <label className="list-item-nested"> Select 1 School (required)</label>
                            </div>

                        }

                        {this.state.editStop == 0 &&
                            <div className='button-container'>
                                <a href="" className="button-left" value="LastLocation" name="lastLocation" onClick={this.useLastLocation} > Use my last location</a>
                                <a href="" className="button-right" value="Get Lat/Long" name="GPS" onClick={(e) => this.geoFindMe(e, true)} > Look up my location </a>
                            </div>
                        }
                        {this.state.validationErrorMsg.block && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.block}</div>}
                        {this.state.validationErrorMsg.locationLength && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.locationLength}</div>}
                        <TextInput type="number" pattern="\d*" min="0" stateValue={this.state.stop.location.blockNumber} name="blockNumber" className="list-item" label="Block Number:" onChange={this.handleBlockChange} onBlur={this.updateLocation} />
                        {this.state.validationErrorMsg.streetName && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.streetName}</div>}
                        <TextInput type="text" stateValue={this.state.stop.location.streetName} name="streetName" className="list-item" label="Street Name:" onChange={this.updateLocation} />
                        <p><strong> - or - </strong></p>
                        <TextInput type="text" stateValue={this.state.stop.location.intersection} name="intersection" className="list-item" label="Closest Intersection:" onChange={this.updateLocation} />
                        <CheckBox2 key="Location Options" className="list-item" checked={this.state.stop.location.toggleLocationOptions} value="More Location Options" name="Location Options" onClick={(e) => this.updateBoolCheckBox(e, 'location', 'toggleLocationOptions')} />
                        {this.state.stop.location.toggleLocationOptions &&
                            <div>

                                <p><strong> - or - </strong></p>
                                <TextInput type="text" stateValue={this.state.stop.location.highwayExit} name="highwayExit" className="list-item" label="Highway and closest exit:" onChange={this.updateLocation} />
                                <p><strong> - or - </strong></p>
                                <TextInput type="text" stateValue={this.state.stop.location.landMark} name="landMark" className="list-item" label="Road marker, landmark or other:" onChange={this.updateLocation} />
                                <p><small> Note: Do not provide a street address if the location is a residence. </small></p>
                            </div>
                        }

                        {/*<h3>City</h3>
                        <span className='required'>required</span>*/}
                        {this.state.validationErrorMsg.city && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.city}</div>}

                        {/*<TextInput type="text" stateValue={this.state.stop.location.city} name="city" className="list-item" label="City:" onChange={this.updateLocation} />*/}


                        {!this.state.stop.location.outOfCounty &&
                            <div className="text-field-view" >
                                <label className="list-item" >City:</label>
                                <CheckBox2 key="outOfCounty" className="list-item" checked={this.state.stop.location.outOfCounty} value="Out of County?" name="OOC" onClick={(e) => this.updateBoolCheckBox(e, 'location', 'outOfCounty')} />
                                <Tags tags={this.state.stop.location.city.codes} className='list-item'
                                    suggestions={this.state.codes.CountyCities}
                                    autofocus={false}
                                    allowDeleteFromEmptyInput={false}
                                    placeholder='Add City'
                                    classNames={{ tags: 'ReactTags__tags_unnested' }}
                                    handleDelete={(e) => this.handleCodeDelete(e, 'city', 'codes')}
                                    handleAddition={(e) => this.handleCodeAdd(e, 'city', 'CountyCities')} />
                            </div>
                        }
                        {this.state.stop.location.outOfCounty &&
                            <div className="text-field-view" >
                                <label className="list-item" >Out of County City:</label>
                                <CheckBox2 key="outOfCounty" className="list-item" checked={this.state.stop.location.outOfCounty} value="Out of County?" name="OOC" onClick={(e) => this.updateBoolCheckBox(e, 'location', 'outOfCounty')} />
                                <Tags tags={this.state.stop.location.city.codes} className='list-item'
                                    suggestions={this.state.codes.OutOfCountyCities}
                                    autofocus={false}
                                    allowDeleteFromEmptyInput={false}
                                    placeholder='Add City'
                                    classNames={{ tags: 'ReactTags__tags_unnested' }}
                                    handleDelete={(e) => this.handleCodeDelete(e, 'city', 'codes')}
                                    handleAddition={(e) => this.handleCodeAdd(e, 'city', 'OutOfCountyCities')} />
                            </div>
                        }

                        {this.state.useBeats > 0 &&
                            <div>
                                {this.state.validationErrorMsg.beat && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.beat}</div>}

                                <div className="text-field-view" >
                                    <label className="list-item" >Beat:</label>
                                    <Tags tags={this.state.stop.location.beat.codes} className='list-item'
                                        suggestions={this.state.codes.Beats}
                                        autofocus={false}
                                        allowDeleteFromEmptyInput={false}
                                        handleFilterSuggestions={this.handleFilterSuggestions}
                                        classNames={{ tags: 'ReactTags__tags_unnested' }}
                                        placeholder='Add Beat'
                                        handleDelete={(e) => this.handleCodeDelete(e, 'beat', 'codes')}
                                        handleAddition={(e) => this.handleCodeAdd(e, 'beat', 'Beats')} />
                                </div>
                            </div>
                        }
                        {this.state.validationErrorMsg.errorFlag && <div className="error-summary error-flip-margin ">Oops, you may have missed something! Please review your selections above.</div>}
                        <div className="button-container">
                            {this.state.submissionEdit == 1 &&
                                <div className="button-container">
                                    {/*                            <a href={this.state.submissionID} className="button-right" onClick={this.continueEdit}>Continue Editing</a>*/}
                                    <a href={this.state.submissionID} className="button-right">Cancel</a>
                                </div>
                            }
                            {this.state.submissionEdit == 0 &&
                                <div className="button-container">
                                    <a href="" className="button-left button-cancel" title="Cancel" name="" onClick={(e) => this.cancelStopInProgress(e)} > Cancel </a>
                                </div>
                            }
                            <a href="" className="button-right" title="Next >>" name="2" onClick={(e) => this.handleFormSectionFilter(e)} > Next </a>
                        </div>
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5
                        </p>
                    </div>
                }
                {this.state.formPartFilter === "2" &&
                    <div className="list-section">
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                        Step {this.state.formPartFilter} of 5 (Person {this.state.personCount})
                        </p>
                        {this.state.stop.location.school &&
                            <div>
                                <h3>Student</h3>
                                <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-224-a-16">§999.224(a)(16)</a>
                                <CheckBox2 key="Student" className="list-item" checked={this.state.stop.Person_Stopped.Is_Stud} value="K-12 Public School Student" name="Student" onClick={(e) => this.updateBoolCheckBox(e, 'Person_Stopped', 'Is_Stud')} />
                            </div>
                        }


                        {this.state.useAdditionalQuestions !== "0" &&
                            <div>
                                <h3>Was your perception formed before or after the stop/detention?</h3>
                                <span className='required'>required</span>
                                {this.state.validationErrorMsg.PerceptionKnown && <div className="error-alert"> {this.state.validationErrorMsg.PerceptionKnown}</div>}
                                <RadioButton className="list-item" stateValue={this.state.stop.Person_Stopped.PerceptionKnown} value="After" name="After" onClick={(e) => this.radioSelection(e, 'PerceptionKnown')} />
                                <RadioButton className="list-item" stateValue={this.state.stop.Person_Stopped.PerceptionKnown} value="Before" name="Before" onClick={(e) => this.radioSelection(e, 'PerceptionKnown')} />
                            </div>}
                        {this.state.editStop == 1 &&
                            <div className="stops-detail">
                                <PersonPerceived persons={this.state.stop.Person_Stopped} />
                            </div>
                        }
                        {this.state.editStop == 0 &&
                            <div>
                                <h3>Perceived Race or Ethnicity</h3>
                                <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-4">§999.226(a)(4)</a>
                                {this.state.validationErrorMsg.race && <div className="error-alert"> {this.state.validationErrorMsg.race} </div>}
                                <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.perceivedRace} node='perceivedRace' node2='race' itemList={perceivedRace} function={this.checkBoxSelection} />


                                <h3>Perceived Gender</h3>
                                <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-5">§999.226(a)(5)</a>
                                {this.state.validationErrorMsg.gender && <div className="error-alert"> {this.state.validationErrorMsg.gender}</div>}
                                <RadioButtonListSection stateValue={this.state.stop.Person_Stopped.perceivedGender} node='perceivedGender' itemList={perceivedGender} function={this.radioSelection} />
                                <CheckBox2 key="genderNonconforming" className="list-item" checked={this.state.stop.Person_Stopped.genderNonconforming} value="Gender nonconforming" name="Gender nonconforming" onClick={(e) => this.updateBoolCheckBox(e, 'Person_Stopped', 'genderNonconforming')} />

                                <h3>Perceived LGBT</h3>
                                <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-6">§999.226(a)(6)</a>
                                {this.state.validationErrorMsg.lgbt && <div className="error-alert"> {this.state.validationErrorMsg.lgbt}</div>}
                                {(this.state.stop.Person_Stopped.perceivedGender !== "Transgender man/boy" && this.state.stop.Person_Stopped.perceivedGender !== "Transgender woman/girl") &&
                                    <RadioButton className="list-item" stateValue={this.state.stop.Person_Stopped.perceivedLgbt} value="No" name="No" onClick={(e) => this.radioSelection(e, 'perceivedLgbt')} />
                                }
                                <RadioButton className="list-item" stateValue={this.state.stop.Person_Stopped.perceivedLgbt} value="Yes" name="Yes" onClick={(e) => this.radioSelection(e, 'perceivedLgbt')} />

                                {/*<RadioButtonListSection stateValue={this.state.stop.perceivedLgbt} node='perceivedLgbt' itemList={lgbt} function={this.radioSelection} />*/}

                                <h3>Perceived Age </h3>
                                <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-7">§999.226(a)(7)</a>
                                {this.state.validationErrorMsg.age && <div className="error-alert"> {this.state.validationErrorMsg.age}</div>}
                                {/*<RadioButtonListSection stateValue={this.state.stop.perceivedAge} node='perceivedAge' itemList={perceivedAge} function={this.radioSelection} />*/}
                                <TextInput type="number" pattern="\d*" min="0" max='120' stateValue={this.state.stop.Person_Stopped.perceivedAge} name="perceivedAge" className="list-item" label="Perceived Age" onChange={this.updatePersonInput} />

                                <h3>Limited or No English Fluency </h3>
                                <a className="required regref" target="_blank" href="/regulation#999-226-a-8">§999.226(a)(8)</a>
                                <CheckBox2 key="perceivedLimitedEnglish" className="list-item" checked={this.state.stop.Person_Stopped.perceivedLimitedEnglish} value="Has Limited or No English Fluency" name="Has Limited or No English Fluency" onClick={(e) => this.updateBoolCheckBox(e, 'Person_Stopped', 'perceivedLimitedEnglish')} />

                                <h3>Perceived Or Known Disability </h3>
                                <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-9">§999.226(a)(9)</a>
                                {this.state.validationErrorMsg.disability && <div className="error-alert"> {this.state.validationErrorMsg.disability}</div>}
                                <CheckBox2 key="None" className="list-item" checked={this.state.stop.Person_Stopped.perceivedOrKnownDisability.map(function (y) { return y.disability }).indexOf("None") > -1} value="None" name="Disability related to hyperactivity or impulsive behavior" onClick={(e) => this.checkBoxSelection(e, 'perceivedOrKnownDisability', 'disability', '', 8)} />
                                {this.state.stop.Person_Stopped.perceivedOrKnownDisability.map(function (y) { return y.disability }).indexOf("None") == -1 &&
                                    <div>
                                        {this.state.stop.location.school && this.state.stop.Person_Stopped.Is_Stud &&
                                            <CheckBox2 key="Disability related to hyperactivity or impulsive behavior" className="list-item" checked={this.state.stop.Person_Stopped.perceivedOrKnownDisability.map(function (y) { return y.disability }).indexOf("Disability related to hyperactivity or impulsive behavior") > -1} value="Disability related to hyperactivity or impulsive behavior" name="Disability related to hyperactivity or impulsive behavior" onClick={(e) => this.checkBoxSelection(e, 'perceivedOrKnownDisability', 'disability', '', 7)} />
                                        }
                                        <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.perceivedOrKnownDisability} node='perceivedOrKnownDisability' node2='disability' itemList={perceivedOrKnowDisability} function={this.checkBoxSelection} />
                                    </div>
                                }
                            </div>
                        }



                        {this.state.validationErrorMsg.errorFlag && <div className="error-summary error-flip-margin ">Oops, you may have missed something! Please review your selections above.</div>}
                        <div className="button-container">
                            <a href="" className="button-left" title="<< Back" name="1" onClick={(e) => this.handleFormSectionFilter(e)} > Back </a>
                            {this.state.submissionEdit == 1 &&
                                <div className="button-container">
                                    {/*                            <a href={this.state.submissionID} className="button-right" onClick={this.continueEdit}>Continue Editing</a>*/}
                                    <a href={this.state.submissionID} className="button-right">Cancel</a>
                                </div>
                            }
                            {this.state.submissionEdit == 0 &&
                                <div className="button-container">
                                    <a href="" className="button-left button-cancel" title="Cancel" name="" onClick={(e) => this.cancelStopInProgress(e)} > Cancel </a>
                                </div>
                            }
                            <a href="" className="button-right" title="Next >>" name="3" onClick={(e) => this.handleFormSectionFilter(e)} > Next </a>
                        </div>
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5 (Person {this.state.personCount})
                        </p>
                    </div>
                }
                {this.state.formPartFilter === "3" &&
                    <div className="list-section">
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5 (Person {this.state.personCount})
                        </p>
                        {(this.state.personCount > 1 && this.state.editStop == 0) &&
                            <div className="button-container">
                                <a href="" className="button-right" title="Next >>" name="2" onClick={(e) => this.pullForwardPerson(e)} ><span> Pull forward from first Person</span> </a>
                            </div>

                        }
                        <h3>Reason For Stop</h3>
                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-10">§999.226(a)(10)</a>

                        {/*<Codes codes={this.state.codes.VC} />
                        <Codes codes={this.state.codes.PC} />*/}

                        {this.state.validationErrorMsg.reason && <div className="error-alert"> {this.state.validationErrorMsg.reason}</div>}
                        {this.state.stop.location.school && this.state.stop.Person_Stopped.Is_Stud &&
                            <div>

                                <RadioButtonListSection checked={this.state.stop.Person_Stopped.reasonForStop.reason} stateValue={this.state.stop.Person_Stopped.reasonForStop.reason} node="reasonForStop" node2="reason" node2b="details" itemList={reasonsForStop_4} function={this.radioSelection} />
                                {this.state.stop.Person_Stopped.reasonForStop.reason == "Possible conduct warranting discipline under Education Code sections 48900, 48900.2, 48900.3, 48900.4 and 48900.7" &&
                                    <div>
                                        {this.state.validationErrorMsg.eduDiscipline && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.eduDiscipline}</div>}
                                        <RadioButtonListSection stateValue={this.state.stop.Person_Stopped.reasonForStop.details[0].reason} node="reasonForStop" node2="reason" node2b="details" itemList={disciplineUnderEC_1} function={this.radioNestedRadioSelection} />

                                        {this.state.stop.Person_Stopped.reasonForStop.details[0].key == 1 &&
                                            <div>
                                                <Tags tags={this.state.stop.Person_Stopped.reasonForStop.codes}
                                                    suggestions={this.state.codes.EC}
                                                    autofocus={false}
                                                    allowDeleteFromEmptyInput={false}
                                                    placeholder='Add 48900 Sub Code'
                                                    handleDelete={(e) => this.handleCodeDelete(e, 'reasonForStop', 'codes')}
                                                    handleAddition={(e) => this.handleCodeAdd(e, 'reasonForStop', 'EC')}
                                                    handleFilterSuggestions={this.handleFilterSuggestions} />
                                                <label className="list-item-nested"> Select 1 EC code (required)</label>
                                            </div>
                                        }
                                        <RadioButtonListSection stateValue={this.state.stop.Person_Stopped.reasonForStop.details[0].reason} node="reasonForStop" node2="reason" node2b="details" itemList={disciplineUnderEC_2} function={this.radioNestedRadioSelection} />
                                    </div>
                                }
                                <RadioButtonListSection checked={this.state.stop.Person_Stopped.reasonForStop.reason} stateValue={this.state.stop.Person_Stopped.reasonForStop.reason} node="reasonForStop" node2="reason" node2b="details" itemList={reasonsForStop_5} function={this.radioSelection} />
                            </div>
                        }
                        <RadioButtonListSection checked={this.state.stop.Person_Stopped.reasonForStop.reason} stateValue={this.state.stop.Person_Stopped.reasonForStop.reason} node="reasonForStop" node2="reason" node2b="details" itemList={reasonsForStop_1} function={this.radioSelection} />

                        {this.state.stop.Person_Stopped.reasonForStop.reason == "Traffic Violation" &&
                            <div>
                                {this.state.validationErrorMsg.trafficViolation && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.trafficViolation}</div>}


                                <RadioButtonListSection stateValue={this.state.stop.Person_Stopped.reasonForStop.details[0].reason} node="reasonForStop" node2="reason" node2b="details" itemList={trafficViolation} function={this.radioNestedRadioSelection} />



                                <Tags tags={this.state.stop.Person_Stopped.reasonForStop.codes}
                                    suggestions={this.state.codes.AllCodes}
                                    autofocus={false}
                                    allowDeleteFromEmptyInput={false}
                                    placeholder='Add Code'
                                    handleDelete={(e) => this.handleCodeDelete(e, 'reasonForStop', 'codes')}
                                    handleAddition={(e) => this.handleCodeAdd(e, 'reasonForStop', 'AllCodes')}
                                    handleFilterSuggestions={this.handleFilterSuggestions} />
                                <label className="list-item-nested"> Select 1 Offense Code (required)</label>
                            </div>
                        }
                        <RadioButtonListSection checked={this.state.stop.Person_Stopped.reasonForStop.reason} stateValue={this.state.stop.Person_Stopped.reasonForStop.reason} node="reasonForStop" node2="reason" node2b="details" itemList={reasonsForStop_2} function={this.radioSelection} />
                        {this.state.stop.Person_Stopped.reasonForStop.reason == "Reasonable Suspicion" &&
                            <div>
                                {this.state.validationErrorMsg.reasonableSuspicion && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.reasonableSuspicion}</div>}

                                <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.reasonForStop.details} node="reasonForStop" node2="reason" node2b="details" itemList={reasonableSuspicion} function={this.radioNestedCheckBoxSelection} />


                                <Tags tags={this.state.stop.Person_Stopped.reasonForStop.codes}
                                    suggestions={this.state.codes.AllCodes}
                                    placeholder='Add Code'
                                    autofocus={false}
                                    allowDeleteFromEmptyInput={false}
                                    handleDelete={(e) => this.handleCodeDelete(e, 'reasonForStop', 'codes')}
                                    handleAddition={(e) => this.handleCodeAdd(e, 'reasonForStop', 'AllCodes')}
                                    handleFilterSuggestions={this.handleFilterSuggestions} />
                                <label className="list-item-nested"> Select 1 Offense Code (required)</label>

                            </div>
                        }
                        <RadioButtonListSection checked={this.state.stop.Person_Stopped.reasonForStop.reason} stateValue={this.state.stop.Person_Stopped.reasonForStop.reason} node="reasonForStop" node2="reason" node2b="details" itemList={reasonsForStop_3} function={this.radioSelection} />

                        {/**/}
                        {this.state.stop.Person_Stopped.reasonForStop.reason == "Consensual Encounter resulting in a search" &&
                            <div>
                                <p><strong>Search</strong></p>
                                <div className="error-summary error-flip-margin">Your selection indicates that a search was conducted, please select from the search criteria below.</div>
                                {this.state.validationErrorMsg.action && <div className="error-alert  error-flip-margin"> {this.state.validationErrorMsg.action}</div>}

                                <CheckBox2 key="Search of person was conducted" className="list-item-nested" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted") > -1} value="Search of person was conducted" name="Search of person was conducted" onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '18,na')} />

                                <CheckBox2
                                    key="Search of property was conducted"
                                    className="list-item-nested"
                                    checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of property was conducted") > -1}
                                    value="Search of property was conducted"
                                    name="Search of property was conducted"
                                    onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '20,na')} />
                            </div>
                        }
                        {/**/}

                        <p><strong> - and - </strong></p>
                        {this.state.validationErrorMsg.reasonBrief && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.reasonBrief}</div>}
                        <TextInput type="text" stateValue={this.state.stop.Person_Stopped.reasonForStopExplanation} className="list-item" label="Brief Explanation" name="reasonForStopExplanation" onChange={this.updatePersonInput} />
                        <span className='required'>Important: Do not include personally identifying information, such as names, DOBs, addresses, ID numbers, etc.</span><br /><span>{250 - this.state.stop.Person_Stopped.reasonForStopExplanation.length} characters remaining</span>

                        {this.state.validationErrorMsg.errorFlag &&
                            <div className="error-summary error-flip-margin"> Oops, you may have missed something! Please review your selections above.</div>}
                        <div className="button-container">
                            <a href="" className="button-left" title="<< Back" name="2" onClick={(e) => this.handleFormSectionFilter(e)} > Back </a>
                            {this.state.submissionEdit == 1 &&
                                <div className="button-container">
                                    {/*                            <a href={this.state.submissionID} className="button-right" onClick={this.continueEdit}>Continue Editing</a>*/}
                                    <a href={this.state.submissionID} className="button-right">Cancel</a>
                                </div>
                            }
                            {this.state.submissionEdit == 0 &&
                                <div className="button-container">
                                    <a href="" className="button-left button-cancel" title="Cancel" name="" onClick={(e) => this.cancelStopInProgress(e)} > Cancel </a>
                                </div>
                            }
                            <a href="" className="button-right" title="Next >>" name="4" onClick={(e) => this.handleFormSectionFilter(e)} > Next </a>
                        </div>
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5 (Person {this.state.personCount})
                        </p>
                    </div>
                }
                {this.state.formPartFilter === "4" &&
                    <div className="list-section">
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5 (Person {this.state.personCount})
                        </p>

                        <h3>Actions Taken During Stop </h3>
                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-12">§999.226(a)(12)</a>
                        {this.state.validationErrorMsg.action && <div className="error-alert  error-flip-margin"> {this.state.validationErrorMsg.action}</div>}

                        {this.state.stop.Person_Stopped.reasonForStop.reason !== "Consensual Encounter resulting in a search" &&
                            <CheckBox2 key="None" className="list-item" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("None") > -1} value="None" name="None" onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '24,na')} />
                        }

                        {this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (y) { return y.action }).indexOf("None") == -1 &&
                            <div>

                                {this.state.stop.location.school && this.state.stop.Person_Stopped.Is_Stud &&
                                    <CheckBox2 key="Admission or written statement obtained from student" className="list-item" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Admission or written statement obtained from student") > -1} value="Admission or written statement obtained from student" name="Admission or written statement obtained from student" onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '23,na')} />
                                }
                                <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.actionsTakenDuringStop} node="actionsTakenDuringStop" node2="action" node2b="details" itemList={actionsTakenDuringStop_1} function={this.checkBoxSelection} />


                                <CheckBox2 key="Vehicle impounded" className="list-item" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Vehicle impounded") > -1} value="Vehicle impounded" name="Vehicle impounded" onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '22,na')} />

                                <p><strong>Search</strong></p>
                                {this.state.validationErrorMsg.search && <div className="error-alert  error-flip-margin"> {this.state.validationErrorMsg.search}</div>}
                                <CheckBox2 key="Asked for consent to search person" className="list-item" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search person") > -1} value="Asked for consent to search person" name="Asked for consent to search person" onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '17,N')} />
                                {this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search person") > -1 &&
                                    <CheckBox2 key="personSearchConsentGiven" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop[this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search person")].personSearchConsentGiven} className="list-item-nested" value="Person Search Consent Given" name="personSearchConsentGiven" onClick={(e) => this.searchConsentGiven(e)} />
                                }

                                {this.state.stop.Person_Stopped.reasonForStop.reason === "Consensual Encounter resulting in a search" &&
                                    <CheckBoxDisabled
                                        key="Search of person was conducted"
                                        className="list-item"
                                        checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted") > -1}
                                        value="Search of person was conducted"
                                        name="Search of person was conducted"
                                        onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '18,na')} />
                                }
                                {this.state.stop.Person_Stopped.reasonForStop.reason !== "Consensual Encounter resulting in a search" &&
                                    <CheckBox2 key="Search of person was conducted" className="list-item" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted") > -1} value="Search of person was conducted" name="Search of person was conducted" onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '18,na')} />
                                }
                                <CheckBox2 key="Asked for consent to search property" className="list-item" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search property") > -1} value="Asked for consent to search property" name="Asked for consent to search property" onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '19,N')} />
                                {this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search property") > -1 &&
                                    <CheckBox2
                                        key="propertySearchConsentGiven"
                                        checked={this.state.stop.Person_Stopped.actionsTakenDuringStop[this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search property")].propertySearchConsentGiven}
                                        className="list-item-nested"
                                        value="Property Search Consent Given"
                                        name="propertySearchConsentGiven"
                                        onClick={(e) => this.searchConsentGiven(e)} />
                                }

                                {this.state.stop.Person_Stopped.reasonForStop.reason === "Consensual Encounter resulting in a search" &&
                                    <CheckBoxDisabled
                                        key="Search of property was conducted"
                                        className="list-item"
                                        checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of property was conducted") > -1}
                                        value="Search of property was conducted"
                                        name="Search of property was conducted"
                                        onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '20,na')} />
                                }
                                {this.state.stop.Person_Stopped.reasonForStop.reason !== "Consensual Encounter resulting in a search" &&
                                    <CheckBox2
                                        key="Search of property was conducted"
                                        className="list-item"
                                        checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of property was conducted") > -1}
                                        value="Search of property was conducted"
                                        name="Search of property was conducted"
                                        onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '20,na')} />
                                }
                                {(this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted") > -1 || this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of property was conducted") > -1) &&
                                    <div>

                                        <h4 className="">Basis for Search </h4>
                                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-12-b">§999.226(a)(12)(B)</a>
                                        {this.state.validationErrorMsg.searchBasis && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.searchBasis}</div>}


                                        {this.state.stop.location.school && this.state.stop.Person_Stopped.Is_Stud &&
                                            <CheckBox2 key="Suspected violation of school policy" checked={this.state.stop.Person_Stopped.basisForSearch.map(function (y) { return y.basis }).indexOf("Suspected violation of school policy") > -1} className="list-item-nested" value="Suspected violation of school policy" name="Suspected violation of school policy" onClick={(e) => this.checkBoxSelection(e, 'basisForSearch', 'basis', '', 13)} />
                                        }
                                        <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.basisForSearch} itemList={searchOfPersonOrPropertyConducted} node="basisForSearch" node2="basis" function={this.checkBoxSelection} />

                                        {this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of property was conducted") > -1 &&
                                            <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.basisForSearch} itemList={searchOfPersonOrPropertyConducted_VehInv} node="basisForSearch" node2="basis" function={this.checkBoxSelection} />
                                        }
                                        {(this.state.stop.Person_Stopped.basisForSearch.map(function (x) { return x.key; }).indexOf(4) == -1 || this.state.stop.Person_Stopped.basisForSearch.length > 1) &&
                                            <div>
                                                {this.state.validationErrorMsg.searchBrief && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.searchBrief}</div>}
                                                <TextInput type="text" stateValue={this.state.stop.Person_Stopped.basisForSearchBrief} className="list-item-nested" label="Brief Explanation (250 characters)" name="basisForSearchBrief" onChange={this.updatePersonInput} />
                                                <span className='required list-item-nested'>Important: Do not include personally identifying information, such as names, DOBs, addresses, ID numbers, etc.</span>
                                                <span className="indent">{250 - this.state.stop.Person_Stopped.basisForSearchBrief.length}  characters remaining</span>
                                            </div>
                                        }

                                    </div>
                                }

                                <p><strong>Seizure</strong></p>
                                <CheckBox2 key="Property was seized" className="list-item" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Property was seized") > -1} value="Property was seized" name="Property was seized" onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '21,na')} />
                                {this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Property was seized") > -1 &&
                                    <div>
                                        <h4 className="">Basis for Property Seizure </h4>
                                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-12-d-1">§999.226(a)(12)(D)(1)</a>
                                        {this.state.validationErrorMsg.seizureBasis && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.seizureBasis}</div>}

                                        {this.state.stop.location.school && this.state.stop.Person_Stopped.Is_Stud &&
                                            <CheckBox2 key="Suspected violation of school policy" checked={this.state.stop.Person_Stopped.basisForPropertySeizure.map(function (y) { return y.basis }).indexOf("Suspected violation of school policy") > -1} className="list-item-nested" value="Suspected violation of school policy" name="Suspected violation of school policy" onClick={(e) => this.checkBoxSelection(e, 'basisForPropertySeizure', 'basis', '', 6)} />
                                        }
                                        <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.basisForPropertySeizure} itemList={basisForPropertySeizure} node="basisForPropertySeizure" node2="basis" function={this.checkBoxSelection} />
                                        <h4 className="">Type of Property Seized </h4>
                                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-12-d-2">§999.226(a)(12)(D)(2)</a>
                                        {this.state.validationErrorMsg.seizureProperty && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.seizureProperty}</div>}
                                        <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.typeOfPropertySeized} node="typeOfPropertySeized" node2="type" itemList={typeOfPropertySeized} function={this.checkBoxSelection} />
                                    </div>
                                }
                            </div>
                        }

                        <h3>Contraband or Evidence Discovered</h3>
                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-12-c">§999.226(a)(12)(C)</a>
                        {this.state.validationErrorMsg.contraband && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.contraband}</div>}

                        {/* *** Uncomment these lines to hide 'None' optioin for "Contraband or Evidence Discovered", per DOJ's Error Code RV289 ***  
                      
                     {(this.state.stop.Person_Stopped.basisForPropertySeizure.map(function (x) { return x.basis; }).indexOf("Contraband") == -1 &&
                        this.state.stop.Person_Stopped.basisForPropertySeizure.map(function (x) { return x.basis; }).indexOf("Evidence") == -1) &&
*/}
                        {/*                    }*/}
                        {this.state.stop.Person_Stopped.contrabandOrEvidenceDiscovered.map(function (y) { return y.contraband }).indexOf("None") == -1 &&
                            <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.contrabandOrEvidenceDiscovered} itemList={contrabandOrEvidence} node="contrabandOrEvidenceDiscovered" node2="contraband" function={this.checkBoxSelection} />
                        }
                        <CheckBox2 key="None1" className="list-item" checked={this.state.stop.Person_Stopped.contrabandOrEvidenceDiscovered.map(function (x) { return x.contraband; }).indexOf("None") > -1} value="None" name="None" onClick={(e) => this.checkBoxSelection(e, 'contrabandOrEvidenceDiscovered', 'contraband', '', 1)} />

                        <h3>Result of Stop </h3>
                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-13">§999.226(a)(13)</a>
                        {this.state.validationErrorMsg.result && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.result}</div>}

                        {/*                       <CheckBox2 key="No Action" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("No Action") > -1} value="No Action" name="No Action" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 1)} /> */}
                        {this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("No Action") == -1 &&
                            <div>
                                {this.state.stop.location.school && this.state.stop.Person_Stopped.Is_Stud &&
                                    <div>
                                        <CheckBox2 key="Referral to school administrator" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Referral to school administrator") > -1} value="Referral to school administrator" name="Referral to school administrator" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 12)} />
                                        <CheckBox2 key="Referral to school counselor or other support staff" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Referral to school counselor or other support staff") > -1} value="Referral to school counselor or other support staff" name="Referral to school counselor or other support staff" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 13)} />
                                    </div>
                                }

                                <CheckBox2 key="Warning (verbal or written)" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Warning (verbal or written)") > -1} value="Warning (verbal or written)" name="Warning (verbal or written)" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 2)} />

                                {this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Warning (verbal or written)") > -1 &&

                                    <div>
                                        {(this.state.stop.Person_Stopped.reasonForStop.codes.length > 0) &&
                                            <div className="button-container">
                                                <a href="" className="button-right" title="Pull Code" onClick={(e) => this.pullReasonCode(e, '', 'AllCodes', 'resultOfStop', 'result', 'Warning (verbal or written)')} ><span> Pull from Reason Code</span> </a>
                                            </div>

                                        }
                                        <Tags tags={this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (y) { return y.result }).indexOf("Warning (verbal or written)")].codes}
                                            suggestions={this.state.codes.AllCodes}
                                            placeholder='Add Code'
                                            autofocus={false}
                                            allowDeleteFromEmptyInput={false}
                                            handleDelete={(e) => this.handleCodeDelete(e, 'resultOfStop', '', 'result', 'Warning (verbal or written)')}
                                            handleAddition={(e) => this.handleCodeAdd(e, '', 'AllCodes', 'resultOfStop', 'result', 'Warning (verbal or written)')}
                                            handleFilterSuggestions={this.handleFilterSuggestions} />

                                        <label className="list-item-nested"> Select Code (up to 5)</label>
                                    </div>
                                }
                                <CheckBox2 key="Citation for infraction" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Citation for infraction") > -1} value="Citation for infraction" name="Citation for infraction" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 3)} />
                                {this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Citation for infraction") > -1 &&
                                    <div>
                                        {(this.state.stop.Person_Stopped.reasonForStop.codes.length > 0) &&
                                            <div className="button-container">
                                                <a href="" className="button-right" title="Pull Code" onClick={(e) => this.pullReasonCode(e, '', 'AllCodes', 'resultOfStop', 'result', 'Citation for infraction')} ><span> Pull from Reason Code</span> </a>
                                            </div>

                                        }
                                        <Tags tags={this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (y) { return y.result }).indexOf("Citation for infraction")].codes}
                                            suggestions={this.state.codes.AllCodes}
                                            placeholder='Add Code'
                                            autofocus={false}
                                            allowDeleteFromEmptyInput={false}
                                            handleDelete={(e) => this.handleCodeDelete(e, 'resultOfStop', '', 'result', 'Citation for infraction')}
                                            handleAddition={(e) => this.handleCodeAdd(e, '', 'AllCodes', 'resultOfStop', 'result', 'Citation for infraction')}
                                            handleFilterSuggestions={this.handleFilterSuggestions} />

                                        <label className="list-item-nested"> Select Code (up to 5)</label>
                                    </div>
                                }
                                <CheckBox2 key="In-field cite and release" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("In-field cite and release") > -1} value="In-field cite and release" name="In-field cite and release" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 4)} />
                                {this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("In-field cite and release") > -1 &&
                                    <div>
                                        {(this.state.stop.Person_Stopped.reasonForStop.codes.length > 0) &&
                                            <div className="button-container">
                                                <a href="" className="button-right" title="Pull Code" name="2" onClick={(e) => this.pullReasonCode(e, '', 'AllCodes', 'resultOfStop', 'result', 'In-field cite and release')} ><span> Pull from Reason Code</span> </a>
                                            </div>

                                        }
                                        <Tags tags={this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (y) { return y.result }).indexOf("In-field cite and release")].codes}
                                            suggestions={this.state.codes.AllCodes}
                                            placeholder='Add Code'
                                            autofocus={false}
                                            allowDeleteFromEmptyInput={false}
                                            handleDelete={(e) => this.handleCodeDelete(e, 'resultOfStop', '', 'result', 'In-field cite and release')}
                                            handleAddition={(e) => this.handleCodeAdd(e, '', 'AllCodes', 'resultOfStop', 'result', 'In-field cite and release')}
                                            handleFilterSuggestions={this.handleFilterSuggestions} />

                                        <label className="list-item-nested"> Select Code (up to 5)</label>
                                    </div>
                                }
                                <CheckBox2 key="Custodial Arrest pursuant to outstanding warrant" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Custodial Arrest pursuant to outstanding warrant") > -1} value="Custodial Arrest pursuant to outstanding warrant" name="Custodial Arrest pursuant to outstanding warrant" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 5)} />
                                <CheckBox2 key="Custodial Arrest without warrant" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Custodial Arrest without warrant") > -1} value="Custodial Arrest without warrant" name="Custodial Arrest without warrant" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 6)} />
                                {this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Custodial Arrest without warrant") > -1 &&
                                    <div>
                                        {(this.state.stop.Person_Stopped.reasonForStop.codes.length > 0) &&
                                            <div className="button-container">
                                                <a href="" className="button-right" title="Pull Code" name="2" onClick={(e) => this.pullReasonCode(e, '', 'AllCodes', 'resultOfStop', 'result', 'Custodial Arrest without warrant')} ><span> Pull from Reason Code</span> </a>
                                            </div>

                                        }
                                        <Tags tags={this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (y) { return y.result }).indexOf("Custodial Arrest without warrant")].codes}
                                            suggestions={this.state.codes.AllCodes}
                                            placeholder='Add Code'
                                            autofocus={false}
                                            allowDeleteFromEmptyInput={false}
                                            handleDelete={(e) => this.handleCodeDelete(e, 'resultOfStop', '', 'result', 'Custodial Arrest without warrant')}
                                            handleAddition={(e) => this.handleCodeAdd(e, '', 'AllCodes', 'resultOfStop', 'result', 'Custodial Arrest without warrant')}
                                            handleFilterSuggestions={this.handleFilterSuggestions} />

                                        <label className="list-item-nested">Select Code (up to 5)</label>
                                    </div>
                                }
                                <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.resultOfStop} node="resultOfStop" node2="result" node2b="details" itemList={resultOfStop} function={this.checkBoxSelection} />
                            </div>
                        }
                        <br />
                        <CheckBox2 key="No Action" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("No Action") > -1} value="No Action" name="No Action" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 1)} />
                        {this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("No Action") == -1 &&
                            <div>
                                <CheckBox2 key="Contacted U.S. Department of Homeland Security" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Contacted U.S. Department of Homeland Security") > -1} value="Contacted U.S. Department of Homeland Security" name="Contacted U.S. Department of Homeland Security" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 5)} />
                            </div>
                        }
                        <div className="text-field-view">

                        </div>
                        {this.state.validationErrorMsg.errorFlag && <div className="error-summary error-flip-margin ">Oops, you may have missed something! Please review your selections above.</div>}
                        <div className="button-container">
                            <a href="" className="button-left" title="<< Back" name="3" onClick={(e) => this.handleFormSectionFilter(e)} > Back </a>
                            {this.state.submissionEdit == 1 &&
                                <div className="button-container">
                                    {/*                            <a href={this.state.submissionID} className="button-right" onClick={this.continueEdit}>Continue Editing</a>*/}
                                    <a href={this.state.submissionID} className="button-right">Cancel</a>
                                </div>
                            }
                            {this.state.submissionEdit == 0 &&
                                <div className="button-container">
                                    <a href="" className="button-left button-cancel" title="Cancel" name="" onClick={(e) => this.cancelStopInProgress(e)} > Cancel </a>
                                </div>
                            }
                            <a href="" className="button-right" title="Next >>" name="5" onClick={(e) => this.handleFormSectionFilter(e)} > Next </a>
                        </div>
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5 (Person {this.state.personCount})
                        </p>
                    </div>
                }
                {this.state.formPartFilter === "5" &&
                    <div className="list-section">
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5
                        </p>
                        <h3>Review and Submit </h3>
                        {/*<Person Count: {this.state.personCount}
                        pre>{JSON.stringify(this.state.stop, null, 2)}</pre>*/}

                        <div className="stops-detail">
                            {this.state.editStop == 0 &&
                                <label>Person Count <pre>{this.state.personCount}</pre></label>
                            }
                            <ul>
                                <ListValue className="" labelValue="Date" stateValue={this.state.stop.date} />
                                <ListValue className="" labelValue="Time" stateValue={this.state.stop.time} />
                                <li>
                                    Location
                                    <ul>
                                        {this.state.stop.location.school &&
                                            <ListValue className="" labelValue="School Name" stateValue={this.state.stop.location.schoolName.codes[0].text} />
                                        }
                                        {this.state.stop.location.intersection &&
                                            <ListValue className="" labelValue="Intersection" stateValue={this.state.stop.location.intersection} />
                                        }
                                        {this.state.stop.location.blockNumber &&
                                            <ListValue className="" labelValue="Block" stateValue={this.state.stop.location.blockNumber} />
                                        }
                                        {this.state.stop.location.streetName &&
                                            <ListValue className="" labelValue="Street" stateValue={this.state.stop.location.streetName} />
                                        }
                                        {this.state.stop.location.city.codes[0] &&
                                            <ListValue className="" labelValue="City" stateValue={this.state.stop.location.city.codes[0].text} />
                                        }
                                        {this.state.stop.location.beat.codes[0] &&
                                            <ListValue className="" labelValue="Beat" stateValue={this.state.stop.location.beat.codes[0].text} />
                                        }
                                        {this.state.stop.location.landMark &&
                                            <ListValue className="" labelValue="Landmark" stateValue={this.state.stop.location.landMark} />
                                        }
                                        {this.state.stop.location.highwayExit &&
                                            <ListValue className="" labelValue="Highway Exit" stateValue={this.state.stop.location.highwayExit} />
                                        }
                                    </ul>
                                </li>
                                <ListValue className="" labelValue="Duration (m)" stateValue={this.state.stop.stopDuration} />
                                {this.state.stop.stopInResponseToCFS &&
                                    <ListBoolean className="" labelValue="Stop In Response To CFS" stateValue={this.state.stop.stopInResponseToCFS} />
                                }
                            </ul>
                            <ListPerson persons={this.state.stop.ListPerson_Stopped} />
                            {this.state.editStop == 1 &&
                                <div>
                                    {this.state.validationErrorMsg.changeAuditReason && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.changeAuditReason}</div>}
                                    <div>
                                        <TextInput type="text" stateValue={this.state.changeAuditReason} className="list-item" label="Please Add Reason for Change" name="changeAuditReason" onChange={(e) => this.updateChangeAuditReason(e)} />
                                        <span>{250 - this.state.changeAuditReason.length} characters remaining</span>
                                    </div>
                                </div>
                            }
                        </div>

                        {/*<div id="stop"></div>*/}
                        {this.state.editStop == 0 &&
                            <div className='button-container'>
                                <a href="" className="button-left" title="Add Person" onClick={this.addPerson} > + Add Person </a>
                            </div>
                        }
                        <div className="button-container">
                            <a href="" className="button-left" title="<< Back" name="4" onClick={(e) => this.handleFormSectionFilter(e)} > Back </a>
                            {this.state.submissionEdit == 1 &&
                                <div className="button-container">
                                    <a href={this.state.submissionID} className="button-right">Cancel</a>
                                </div>
                            }
                            {this.state.submissionEdit == 0 &&
                                <div className="button-container">
                                    <a href="" className="button-left button-cancel" title="Cancel" name="" onClick={(e) => this.cancelStopInProgress(e)} > Cancel </a>
                                </div>
                            }
                            {!this.state.loader &&
                                <a href="" className="button-right" title="Sumbit" value="Submit" name="Submit" onClick={this.handleSubmit} > Submit </a>
                            }
                            {this.state.loader &&
                                <a href="" className="button-right" title="" value="Submit" name="Submit"  > Submitting.. </a>
                            }
                            {/*<a href="" className="button-left" title="" name="" onClick={this.setProgressCache} >Update Progress</a>*/}
                        </div>
                        <p className="styled">
                            <progress value={this.state.progress} max="100">{this.state.progress}</progress>
                            Step {this.state.formPartFilter} of 5
                        </p>
                    </div>
                }
                {this.state.formPartFilter === "6" &&
                    <div>
                        {this.state.editStop == 0 &&
                            <div className="list-section">
                                <h3>RIPA STOP APP</h3>
                                <p>
                                    Thank you for your submission.
                            </p>
                                <div className="button-container">
                                    <a href="/Stops" className="button-left" >My Stops</a>
                                    <a href="/" className="button-right" >Start New</a>
                                </div>
                            </div>
                        }
                        {this.state.editStop == 1 &&
                            <div className="list-section">
                                <h3>Update has been saved</h3>
                                {this.state.submissionEdit == 0 &&
                                    <div className="button-container">
                                        {/*<a href="/StopsEdit/Index/0?submissionId=0" className="button-right" >New Search</a>*/}
                                        <a href="/StopsEdit?stopid=0&submissionId=0" className="button-right" >New Search</a>
                                    </div>
                                }
                                {this.state.submissionEdit == 1 &&
                                    <div className="button-container">
                                        {/*                            <a href={this.state.submissionID} className="button-right" onClick={this.continueEdit}>Continue Editing</a>*/}
                                        <a href={this.state.submissionID} className="button-right">Continue Editing</a>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                }
                {this.state.debug == "True" &&
                    <div>
                        <input type="checkbox" checked={this.state.toggleJson} onClick={(e) => this.toggleJson(e)} />
                        {this.state.toggleJson &&
                            <pre>{JSON.stringify(this.state, null, 2)}</pre>
                        }
                    </div>
                }
            </form>
        );
    }
}
class CheckBoxListSection extends React.Component {
    render(props) {
        return (
            <div className="list-view">
                <div className="list-wrapper">
                    {this.props.itemList.map(
                        (item) =>
                            <CheckBox
                                key={item.key}
                                className={item.className}
                                value={item.value}
                                onClick={(e) => this.props.function(e, this.props.node, this.props.node2, this.props.node2b, item.key)}
                                checked={this.props.stateValue != null &&
                                    this.props.stateValue.map(function (x) {
                                        for (key in x) {
                                            if (x.hasOwnProperty(key)) {
                                                return x[key]
                                            }
                                        }
                                    }).indexOf(item.value) > -1 ? true : null
                                }
                            />
                    )}
                </div>
            </div>
        );
    }
}
class CheckBox extends React.Component {
    render(props) {
        return (
            <div className={this.props.className}>
                <input type="checkbox" key={this.props.key} value={this.props.value} name={this.props.value} checked={this.props.checked} onClick={this.props.onClick} />
                <label htmlFor={this.props.value}>{this.props.value}</label>
            </div>
        );
    }
}
class CheckBox2 extends React.Component {
    render(props) {
        return (
            <div className={this.props.className}>
                <input type="checkbox" key={this.props.key} value={this.props.value} name={this.props.value} checked={this.props.checked} onClick={this.props.onClick} />
                <label htmlFor={this.props.value}>{this.props.value}</label>
            </div>
        );
    }
}

class CheckBoxDisabled extends React.Component {
    render(props) {
        return (
            <div className={this.props.className}>
                <input type="checkbox" key={this.props.key} value={this.props.value} name={this.props.value} checked={this.props.checked} onClick={this.props.onClick} disabled />
                <label htmlFor={this.props.value}>{this.props.value}</label>
            </div>
        );
    }
}

class RadioButtonListSection extends React.Component {
    render(props) {
        return (
            <div className="list-view">
                <div className="list-wrapper">
                    {this.props.itemList.map(
                        (item) =>
                            <RadioButton
                                key={item.key}
                                className={item.className}
                                value={item.value}
                                onClick={(e) => this.props.function(e, this.props.node, item.key, this.props.node2, this.props.node2b)}
                                stateValue={this.props.stateValue} />
                    )}
                </div>
            </div>
        );
    }
}

class RadioButton extends React.Component {
    render(props) {
        return (
            <div className={this.props.className}>
                <input type="radio" key={this.props.key} value={this.props.value} name={this.props.value} checked={this.props.stateValue === this.props.value} onClick={this.props.onClick} />
                <label htmlFor={this.props.value}>{this.props.value}</label>
            </div>
        );
    }
}
class TextInput extends React.Component {
    render(props) {
        return (
            <div className="text-field-view">
                <label htmlFor="id" className={this.props.className} >{this.props.label}</label>
                <input value={this.props.stateValue} type={this.props.type} min={this.props.min} max={this.props.max} name={this.props.name} className={this.props.className} pattern={this.props.pattern} onChange={this.props.onChange} onBlur={this.props.onBlur} />
            </div>
        );
    }
}

class LookupInput extends React.Component {
    render(props) {
        return (
            <div className="text-field-view">
                <label htmlFor="id" className={this.props.className}>{this.props.label}</label>
                <input type="text" className={this.props.className} id="id" value="Code lookup" />
            </div>
        );
    }
}
class Codes extends React.Component {
    render(props) {
        return (
            <select className={this.props.className}>
                <option value="" ></option>
                {this.props.codes.map((item) => <option key={item.Offense_Code} value={item.Description}>{item.Description}</option>)}
            </ select>
        );
    }
}

class Button extends React.Component {
    render(props) {
        return (
            <div className="button-container">
                <input className={this.props.className} type="submit" value={this.props.value} name={this.props.name} onClick={this.props.onClick} />
            </div>
        );
    }
}

function PersonPerceived(props) {
    const persons = props.persons;
    //const pList = personsL.map((p) =>
    return (
        <ul>
            {/*<li>Person {personsL.indexOf(p) + 1}</li>*/}
            {/*{p.Is_Stud &&
                    <ListValue className="" labelValue="Is Student" stateValue={JSON.stringify(p.Is_Stud, null, 2)} />
                }*/}
            <li>
                Perceived Race
                        <ListArray list={persons.perceivedRace} param1="race" />
            </li>
            <ListValue className="" labelValue="Perceived Age" stateValue={persons.perceivedAge} />
            <ListValue className="" labelValue="Perceived Gender" stateValue={persons.perceivedGender} />
            <ListValue className="" labelValue="Gender Nonconforming" stateValue={JSON.stringify(persons.genderNonconforming, null, 2)} />
            <ListValue className="" labelValue="Perceived LGBT" stateValue={persons.perceivedLgbt} />
            {persons.perceivedLimitedEnglish &&
                <ListValue className="" labelValue="Limited English" stateValue={JSON.stringify(persons.perceivedLimitedEnglish, null, 2)} />
            }
            <li>
                Perceived Disability
                        <ListArray list={persons.perceivedOrKnownDisability} param1="disability" />
            </li>

        </ul>
        //);
        //return (
        //    <div>{pList}</div>
    );
}

const perceivedRace = [
    { key: 1, value: "Asian", className: "list-item", onClick: "" },
    { key: 2, value: "Black/African American", className: "list-item", onClick: "" },
    { key: 3, value: "Hispanic/Latino/a", className: "list-item", onClick: "" },
    { key: 4, value: "Middle Eastern or South Asian", className: "list-item", onClick: "" },
    { key: 5, value: "Native American", className: "list-item", onClick: "" },
    { key: 6, value: "Pacific Islander", className: "list-item", onClick: "" },
    { key: 7, value: "White", className: "list-item", onClick: "" }
];
const perceivedGender = [
    { key: 1, value: "Male", className: "list-item", onClick: "" },
    { key: 2, value: "Female", className: "list-item", onClick: "" },
    { key: 3, value: "Transgender man/boy", className: "list-item", onClick: "" },
    { key: 4, value: "Transgender woman/girl", className: "list-item", onClick: "" }
];
const lgbt = [
    { value: "Yes", className: "list-item", onClick: "" },
    { value: "No", className: "list-item", onClick: "" }
];
const perceivedOrKnowDisability = [
    { key: 1, value: "Deafness or difficulty hearing", className: "list-item", onClick: "" },
    { key: 2, value: "Speech impairment or limited use of language", className: "list-item", onClick: "" },
    { key: 3, value: "Blind or limited vision", className: "list-item", onClick: "" },
    { key: 4, value: "Mental health condition", className: "list-item", onClick: "" },
    { key: 5, value: "Intellectual or developmental disability, including dementia", className: "list-item", onClick: "" },
    { key: 6, value: "Other disability", className: "list-item", onClick: "" }
];
const reasonsForStop_1 = [
    { key: 1, value: "Traffic Violation", className: "list-item", onClick: "" }
];
const disciplineUnderEC_1 = [
    { key: 1, value: "48900 - Suspension or expulsion (select subsection)", className: "list-item-nested", onClick: "" }
];
const disciplineUnderEC_2 = [
    { key: 2, value: "48900.2 - Suspension or expulsion for sexual harassment", className: "list-item-nested", onClick: "" },
    { key: 3, value: "48900.3 - Suspension or expulsion for hate violence", className: "list-item-nested", onClick: "" },
    { key: 4, value: "48900.4 - Suspension or expulsion for harassment, threats or intimidation", className: "list-item-nested", onClick: "" },
    { key: 5, value: "48900.7 - Suspension or expulsion for terroristic threats", className: "list-item-nested", onClick: "" }
];
const trafficViolation = [
    { key: 1, value: "Moving Violation", className: "list-item-nested", onClick: "" },
    { key: 2, value: "Equipment Violation", className: "list-item-nested", onClick: "" },
    { key: 3, value: "Non-moving Violation, including Registration Violation", className: "list-item-nested", onClick: "" }
];
const reasonsForStop_2 = [
    { key: 2, value: "Reasonable Suspicion", className: "list-item", onClick: "" }
];
const reasonableSuspicion = [
    { key: 1, value: "Officer witnessed commission of a crime", className: "list-item-nested", onClick: "" },
    { key: 2, value: "Matched suspect description", className: "list-item-nested", onClick: "" },
    { key: 3, value: "Witness or Victim identification of Suspect at the scene", className: "list-item-nested", onClick: "" },
    { key: 4, value: "Carrying Suspicious Object", className: "list-item-nested", onClick: "" },
    { key: 5, value: "Actions indicative of casing a victim or location", className: "list-item-nested", onClick: "" },
    { key: 6, value: "Suspected of Acting as Lookout", className: "list-item-nested", onClick: "" },
    { key: 7, value: "Actions indicative of drug transaction", className: "list-item-nested", onClick: "" },
    { key: 8, value: "Actions indicative of engaging in violent crime", className: "list-item-nested", onClick: "" },
    { key: 9, value: "Other Reasonable Suspicion of a crime", className: "list-item-nested", onClick: "" }
    // { key: 10, value: "New Community Caretaking option (TBD)", className: "list-item-nested", onClick: "" }
];
const reasonsForStop_3 = [
    { key: 3, value: "Known to be on Parole / Probation / PRCS / Mandatory Supervision", className: "list-item", onClick: "" },
    { key: 4, value: "Knowledge of outstanding arrest warrant/wanted person", className: "list-item", onClick: "" },
    { key: 5, value: "Investigation to determine whether the person was truant", className: "list-item", onClick: "" },
    { key: 6, value: "Consensual Encounter resulting in a search", className: "list-item", onClick: "" }
];
const reasonsForStop_4 = [
    { key: 7, value: "Possible conduct warranting discipline under Education Code sections 48900, 48900.2, 48900.3, 48900.4 and 48900.7", className: "list-item", onClick: "" }
];

const reasonsForStop_5 = [
    //{ key: 5, value: "Investigation to determine whether the person was truant", className: "list-item", onClick: "" },
    { key: 8, value: "Determine whether the student violated school policy", className: "list-item", onClick: "" }
];

const EC_Subdivision = [
    "48900(a)(1) - Caused/ attempted/ threatened to cause injury 1",
    "48900(a)(2) - Used force or violence upon person 2",
    "48900(b) - Possessed/sold/furnished a firearm, knife, explosive, etc 3",
    "48900(c) - Possessed/used/sold/furnished/under influence of intoxicant 4",
    "48900(d) - Offered/arranged/negotiated to sell an intoxicant 5",
    "48900(e) - Committed or attempted to commit robbery/extortion 6",
    "48900(f) - Caused or attempted to cause damage to property 7",
    "48900(g) - Stole or attempted to steal property 8",
    "48900(h) - Possessed or used tobacco, or nicotine products 9",
    "48900(i) - Committed an obscene act or engaged in profanity 10",
    "48900(j) - Possess/offer/arrange/negotiate to sell drug paraphernalia 11",
    "48900(k)(1) - Disrupted activities or willfully defied authority 12",
    "48900(l) - Knowingly received stolen property 13",
    "48900(m) - Possessed an imitation firearm 14",
    "48900(n) - Commit/attempt sexual assault or sexual battery 15",
    "48900(o) - Harassed, threatened, or intimidated a witness 16",
    "48900(p) - Offered/arranged/negotiated to sell, or sold Soma 17",
    "48900(q) - Engaged in, or attempted hazing 18",
    "48900(r) - Engaged in bullying 19"
];

const actionsTakenDuringStop_1 = [
    { key: "1,na", value: "Person removed from vehicle by order", className: "list-item", onClick: "" },
    { key: "2,na", value: "Person removed from vehicle by physical contact", className: "list-item", onClick: "" },
    { key: "3,na", value: "Field sobriety test conducted", className: "list-item", onClick: "" },
    { key: "4,na", value: "Curbside detention", className: "list-item", onClick: "" },
    { key: "5,na", value: "Handcuffed or flex cuffed", className: "list-item", onClick: "" },
    { key: "6,na", value: "Patrol car detention", className: "list-item", onClick: "" },
    { key: "7,na", value: "Canine removed from vehicle or used to search", className: "list-item", onClick: "" },
    { key: "8,na", value: "Firearm pointed at person", className: "list-item", onClick: "" },
    { key: "9,na", value: "Firearm discharged or used", className: "list-item", onClick: "" },
    { key: "10,na", value: "Electronic control device used", className: "list-item", onClick: "" },
    { key: "11,na", value: "Impact projectile discharged or used", className: "list-item", onClick: "" },
    { key: "12,na", value: "Canine bit or held person", className: "list-item", onClick: "" },
    { key: "13,na", value: "Baton or other impact weapon used", className: "list-item", onClick: "" },
    { key: "14,na", value: "Chemical spray used", className: "list-item", onClick: "" },
    { key: "15,na", value: "Physical or Vehicle contact", className: "list-item", onClick: "" },
    { key: "16,na", value: "Person photographed", className: "list-item", onClick: "" }
];
const searchOfPersonOrPropertyConducted = [
    { key: 1, value: "Consent given", className: "list-item-nested", onClick: "" },
    { key: 2, value: "Officer Safety/safety of others", className: "list-item-nested", onClick: "" },
    { key: 3, value: "Search Warrant", className: "list-item-nested", onClick: "" },
    { key: 4, value: "Condition of parole / probation/ PRCS / mandatory supervision", className: "list-item-nested", onClick: "" },
    { key: 5, value: "Suspected weapons", className: "list-item-nested", onClick: "" },
    { key: 6, value: "Visible contraband", className: "list-item-nested", onClick: "" },
    { key: 7, value: "Odor of contraband", className: "list-item-nested", onClick: "" },
    { key: 8, value: "Canine detection", className: "list-item-nested", onClick: "" },
    { key: 9, value: "Evidence of crime", className: "list-item-nested", onClick: "" },
    { key: 10, value: "Incident to arrest", className: "list-item-nested", onClick: "" },
    { key: 11, value: "Exigent circumstances/emergency", className: "list-item-nested", onClick: "" }
    //{ key: 12, value: "Vehicle inventory", className: "list-item-nested", onClick: "" }
];
const searchOfPersonOrPropertyConducted_VehInv = [
    { key: 12, value: "Vehicle inventory", className: "list-item-nested", onClick: "" }
];
const contrabandOrEvidence = [
    { key: 2, value: "Firearm(s)", className: "list-item", onClick: "" },
    { key: 3, value: "Ammunition", className: "list-item", onClick: "" },
    { key: 4, value: "Weapon(s) other than a firearm", className: "list-item", onClick: "" },
    { key: 5, value: "Drugs/narcotics", className: "list-item", onClick: "" },
    { key: 6, value: "Alcohol", className: "list-item", onClick: "" },
    { key: 7, value: "Money", className: "list-item", onClick: "" },
    { key: 8, value: "Drug Paraphernalia", className: "list-item", onClick: "" },
    { key: 9, value: "Suspected Stolen property", className: "list-item", onClick: "" },
    { key: 10, value: "Cell phone(s) or electronic device(s)", className: "list-item", onClick: "" },
    { key: 11, value: "Other Contraband or evidence", className: "list-item", onClick: "" }
];
const basisForPropertySeizure = [
    { key: 1, value: "Safekeeping as allowed by law/statute", className: "list-item-nested", onClick: "" },
    { key: 2, value: "Contraband", className: "list-item-nested", onClick: "" },
    { key: 3, value: "Evidence", className: "list-item-nested", onClick: "" },
    { key: 4, value: "Impound of vehicle", className: "list-item-nested", onClick: "" },
    { key: 5, value: "Abandoned property", className: "list-item-nested", onClick: "" }
];
const typeOfPropertySeized = [
    { key: 1, value: "Firearm(s)", className: "list-item-nested", onClick: "" },
    { key: 2, value: "Ammunition", className: "list-item-nested", onClick: "" },
    { key: 3, value: "Weapon(s) other than a firearm", className: "list-item-nested", onClick: "" },
    { key: 4, value: "Drugs/narcotics", className: "list-item-nested", onClick: "" },
    { key: 5, value: "Alcohol", className: "list-item-nested", onClick: "" },
    { key: 6, value: "Money", className: "list-item-nested", onClick: "" },
    { key: 7, value: "Drug Paraphernalia", className: "list-item-nested", onClick: "" },
    { key: 8, value: "Suspected Stolen property", className: "list-item-nested", onClick: "" },
    { key: 9, value: "Cell phone(s) or electronic device(s)", className: "list-item-nested", onClick: "" },
    { key: 10, value: "Vehicle", className: "list-item-nested", onClick: "" },
    { key: 11, value: "Other Contraband or evidence", className: "list-item-nested", onClick: "" }
];
const resultOfStop = [
    { key: 7, value: "Field interview card completed", className: "list-item", onClick: "" },
    { key: 10, value: "Psychiatric hold", className: "list-item", onClick: "" },
    { key: 8, value: "Noncriminal transport or caretaking transport", className: "list-item", onClick: "" },
    { key: 9, value: "Contacted parent/legal guardian or other person responsible for the minor", className: "list-item", onClick: "" },
];
const officerAssignment = [
    { key: 1, value: "Patrol, traffic enforcement, field operations", className: "list-item", onClick: "" },
    { key: 2, value: "Gang enforcement", className: "list-item", onClick: "" },
    { key: 3, value: "Compliance check", className: "list-item", onClick: "" },
    { key: 4, value: "Special events", className: "list-item", onClick: "" },
    { key: 5, value: "Roadblock or DUI sobriety checkpoint", className: "list-item", onClick: "" },
    { key: 6, value: "Narcotics/vice", className: "list-item", onClick: "" },
    { key: 7, value: "Task force", className: "list-item", onClick: "" },
    { key: 8, value: "K1-12 public school inlcuding school resource officer or school police officer", className: "list-item", onClick: "" },
    { key: 9, value: "Investigative/detective", className: "list-item", onClick: "" },
    { key: 10, value: "Other", className: "list-item", onClick: "" }
];

ReactDOM.render(
    <Form />,
    document.getElementById('root')
);