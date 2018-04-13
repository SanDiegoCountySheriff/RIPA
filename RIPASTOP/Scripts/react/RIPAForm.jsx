const Tags = ReactTags.WithContext;
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
                    school: false,
                    schoolName: {
                        codes: []
                    }
                },
                stopDuration: '',
                stopInResponseToCFS: false,
                Person_Stopped: {
                    PID: '',
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
            beat: null,
            debug: false,
            toggleJson: false,
            toggleOfficerOptions: false,
            reverseGeoURI: '',
            progress: 8,
            formPartFilter: '0',
            loader: false,
            personCount: 1,
            templates: {
                motor: {
                    Person_Stopped: {
                        PID: '',
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
                        reasonForStopExplanation: 'Speeding',
                        actionsTakenDuringStop: [{ action: "None", key: 24 }],
                        contrabandOrEvidenceDiscovered: [{ contraband: "None", key: 1 }],
                        basisForSearch: [],
                        basisForSearchBrief: '',
                        basisForPropertySeizure: [],
                        typeOfPropertySeized: [],
                        resultOfStop: [{
                            result: "Citation or infraction",
                            codes: [{ code: "65002", text: "65002 ZZ - LOCAL ORDINANCE VIOL (I) 65002" }],
                            key: 3
                        }]
                    }
                },
                probation: {
                    Person_Stopped: {
                        PID: '',
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
                        reasonForStopExplanation: 'Subject/Location known to be Parole / Probation / PRCS / Mandatory Supervision',
                        actionsTakenDuringStop: [
                            { action: "Curbside detention", key: 4 },
                            { action: "Search of person was conducted", key: 18 },
                            { action: "Search of property was conducted", key: 20 }],
                        contrabandOrEvidenceDiscovered: [{ contraband: "None", key: 1 }],
                        basisForSearch: [{ basis: "Condition of parole / probation/ PRCS / mandatory supervision", key: 4 }],
                        basisForSearchBrief: 'Subject/Location known to be Parole / Probation / PRCS / Mandatory Supervision',
                        basisForPropertySeizure: [],
                        typeOfPropertySeized: [],
                        resultOfStop: [{ result: "No Action", codes: [], key: 1 }]
                    }
                }
            },
            //nightMode: false,
            instrumentation: {
                template: null,
                cacheFlag: false,
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
                errorFlag: false, datetime: '', time: '', duration: '', locationType: '', address: '', school: '',
                gender: '', lgbt: '', race: '', age: '', disability: '', stopType: '', presence: '', reason: '',
                radioDispatch: '', plannedOperation: '',
                trafficViolation: '', reasonableSuspicion: '', eduDiscipline: '', reasonBrief: '', action: '',
                searchBasis: '', searchBrief: '', seizureBasis: '', resultOfStop: '',
                seizureProperty: '', result: '', contraband: '', warning: '', custody: '', years: '', assignment: ''
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
        this.updateLocation = this.updateLocation.bind(this);
        this.useLastLocation = this.useLastLocation.bind(this);
        this.updateDateTime = this.updateDateTime.bind(this);
        this.updateInput = this.updateInput.bind(this);
        this.updatePersonInput = this.updatePersonInput.bind(this);
        this.addPerson = this.addPerson.bind(this);
        this.pullForwardPerson = this.pullForwardPerson.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFormSectionFilter = this.handleFormSectionFilter.bind(this);
        this.geoFindMe = this.geoFindMe.bind(this);
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
                if (val == 'None') {
                    arr = [];
                    newPerson.basisForSearch = [];
                    newPerson.basisForSearchBrief = '';
                    newPerson.contrabandOrEvidenceDiscovered = [];
                    newPerson.basisForPropertySeizure = [];
                    newPerson.typeOfPropertySeized = [];
                }
                arr.push({
                    [node2]: val,
                    //[node2b]: [],
                    key: itemkey
                })
            } else if (node === 'resultOfStop') {

                //this.checkBoxSelection(e, 'resultOfStop', 'result', '', 3
                if (itemkey == 3) {
                    arr.push({
                        [node2]: val, codes: [{ code: "65002", text: "65002 ZZ - LOCAL ORDINANCE VIOL (I) 65002" }], key: itemkey
                    });
                } else {
                    if (val == 'No Action') {
                        arr = []
                    }
                    arr.push({ [node2]: val, codes: [], key: itemkey });
                }
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

    updateLocation(e) {
        var newStop = this.state.stop;

        var newLocation = this.state.stop.location;
        if (e.address) {// update location from reverse geocoder
            newLocation.blockNumber = this.floorInteger(e.address.Street.substr(0, e.address.Street.indexOf(' ')));
            newLocation.streetName = e.address.Street.substr(e.address.Street.indexOf(' ') + 1);
            //newLocation.blockNumber = this.floorInteger(e.address.AddNum);
            //newLocation.streetName = e.address.Address.substr(e.address.Address.indexOf(' ') + 1);
            //newLocation.city = e.address.City == 'SD' ? 'SAN DIEGO' : e.address.City;
            var city = e.address.City == 'SD' ? 'SAN DIEGO' : e.address.City;
            city = city == 'SM' ? 'SAN MARCOS' : city;
            city = city == 'VS' ? 'VISTA' : city;
            city = city == 'ES' ? 'ESCONDIDO' : city;
            if (city != 'CN') {
                if (newLocation.city.codes.length > 0) {
                    newLocation.city.codes.pop();
                }
                newLocation.city.codes.push({
                    code: city,
                    text: city
                });
            }
        } else if (e.error) {
            alert(e.error.details);
            console.log(e.error);
        }
        else {
            var val = e.target.value;
            var name = e.target.name;
            val && (name === 'streetName' || name === 'blockNumber') ? e.target.className = 'list-item' : null;
            newLocation[name] = val;
        }
        newStop.location = newLocation;
        //var location = this.state.stop.location;
        //if (!store.enabled) {
        //if (localStorage.storageAvailable()) {
        //    alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
        //    return
        //}
        //store.set('LastLocation', newLocation);
        localStorage.setItem('LastLocation', JSON.stringify(newLocation));
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
        newStop[name] = val;
        this.setState({ stop: newStop });
    }
    updatePersonInput(e) {
        var val = e.target.value;
        var newStop = this.state.stop.Person_Stopped;
        var name = e.target.name;
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
        var len = n.length - 1;
        var order = Math.pow(10, len);
        var block = Math.floor(n / order);
        return block * order;
    }

    geoSuccess(position) {

        this.geoReverseGeocode(position.coords.longitude, position.coords.latitude);

        this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        //alert("Position recorded.");
    }
    geoFindMe(e) {
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
        navigator.geolocation.getCurrentPosition(this.geoSuccess, error);
        //navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
        //    alert("Geolocation API permissions status: " + result.state);
        //});       
    }
    geoReverseGeocode(x, y) {
        var thiss = this;
        var uri = this.state.reverseGeoURI + '' + x + ',' + y + '&outSR=4326';
        fetch(uri)
            .then(function (response) {
                return response.json()
                    .then(function (json) {
                        console.log(json)
                        thiss.updateLocation(json);
                        return json;
                    }).catch(function (error) {
                        console.log('There has been a problem with your fetch operation: ' + error.message);
                        throw error;
                    });
            });
    }

    addPerson(e) {
        if (confirm("Add additional person?")) {
            var newStop = this.state.stop;
            //var person = this.state.stop.Person_Stopped;
            var count = this.state.personCount;

            //newStop.ListPerson_Stopped.push(person);
            newStop.Person_Stopped = {
                PID: '',
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

    handleSubmit(e) {
        //this.geoFindMe(e);
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

                fetch('/stops/create', {
                    method: 'post',
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
                    alert('There has been a problem with your fetch operation: ' + error.message);
                    throw error;

                });

            }).catch(function (error) {
                thiss.state.loader = false;
                console.log(error);
            });
        }
        e.preventDefault();
    }

    handleFormSectionFilter(e, templatename, includeLocation) {
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

                newStop.ListPerson_Stopped.push(person);
                newStop.Person_Stopped = {};
                this.setState({ stop: newStop });
            }
            if (val == 4 && dir == '<< Back') { //step back from review
                var newStop = this.state.stop;
                var ix = this.state.stop.ListPerson_Stopped.length - 1;
                var person = this.state.stop.ListPerson_Stopped[ix];

                newStop.ListPerson_Stopped.pop();
                newStop.Person_Stopped = person;
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
    validateDate(date) {
        return /^(19|20)?[0-9]{2}[-](0?[1-9]|1[012])[-](0?[1-9]|[12][0-9]|3[01])$/.test(date);
    }
    validateTime(time) {
        return /^([0-2][0-9][:][0-5][0-9]([:][0-5][0-9])?)$/.test(time);
    }
    validateDateTime() {
        var msg = this.state.validationErrorMsg;
        if (!this.validateDate(this.state.stop.date)) {
            msg.datetime = '*Please enter a valid date'
            msg.errorFlag = true;
        } else { msg.datetime = '' }
        if (!this.validateTime(this.state.stop.time)) {
            msg.time = '*Please enter a valid time'
            msg.errorFlag = true;
        } else { msg.time = '' }
        if (this.validateDate(this.state.stop.date) && this.validateTime(this.state.stop.time)) {
            if (moment(this.state.stop.date).isAfter()) {
                msg.datetime = '*Please enter a date in the past'
                msg.errorFlag = true;
            } else {
                msg.datetime = ''
                if (moment(this.state.stop.date + ' ' + this.state.stop.time).isAfter()) {
                    msg.time = '*Please enter a time in the past'
                    msg.errorFlag = true;
                } else { msg.time = ''; msg.errorFlag = false; }
            }
        }
    }
    validateFormSection() {
        var step = this.state.formPartFilter;
        var msg = this.state.validationErrorMsg;
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

                if (this.state.stop.location.school && this.state.stop.location.schoolName.codes.length < 1) {
                    msg.school = '*Please enter a school name'
                    msg.errorFlag = true;
                } else { msg.school = ''; }

                if (this.state.stop.location.city.codes.length < 1) {
                    msg.city = '*Please enter a City'
                    msg.errorFlag = true;
                } else { msg.city = ''; }

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
                } else { msg.assignment = '' }

                this.validateDate(this.state.stop.date) &&
                    this.validateTime(this.state.stop.time) &&
                    this.validateDuration(this.state.stop.stopDuration) &&
                    this.state.stop.location.streetName &&
                    this.state.stop.location.blockNumber &&
                    this.state.stop.location.city.codes.length == 1 &&
                    !msg.school &&
                    !msg.assignment &&
                    !msg.years
                    ? msg.errorFlag = false : null;
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
                (this.state.stop.Person_Stopped.perceivedGender || this.state.stop.Person_Stopped.genderNonconforming) &&
                    this.state.stop.Person_Stopped.perceivedRace.length > 0 &&
                    this.state.stop.Person_Stopped.perceivedLgbt &&
                    this.validateAge(this.state.stop.Person_Stopped.perceivedAge) &&
                    this.state.stop.Person_Stopped.perceivedOrKnownDisability.length > 0 ? msg.errorFlag = false : null;
                break;
            case '3':
                if (!this.state.stop.Person_Stopped.reasonForStop.reason) {
                    msg.reason = '*Please make a selection for Reasons for Stop'
                    msg.errorFlag = true;
                } else {
                    msg.reason = '';
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
                    if (this.state.stop.Person_Stopped.reasonForStop.key == 8) { //education code
                        if (this.state.stop.Person_Stopped.reasonForStop.details.length < 1 || !this.state.stop.Person_Stopped.reasonForStop.details[0].reason) {
                            msg.eduDiscipline = '*Please make a selection for Possible conduct warranting discipline..'
                            msg.errorFlag = true;
                        } else if (this.state.stop.Person_Stopped.reasonForStop.details[0].key == 1 && this.state.stop.Person_Stopped.reasonForStop.codes.length < 1) {
                            msg.eduDiscipline = '*Please add a 48900 Sub Code section'
                            msg.errorFlag = true;
                        } else { msg.eduDiscipline = '', msg.reasonableSuspicion = '', msg.trafficViolation = '' }
                    }
                }
                if (this.state.stop.Person_Stopped.reasonForStopExplanation.length < 5 || this.state.stop.Person_Stopped.reasonForStopExplanation.length > 250) {
                    msg.reasonBrief = '*Please provide a brief explanation regarding the reason for the stop (at least 5 and less than 250 characters)'
                    msg.errorFlag = true;
                } else { msg.reasonBrief = '' }

                this.state.stop.Person_Stopped.reasonForStop.reason &&
                    this.state.stop.Person_Stopped.reasonForStopExplanation &&
                    !msg.reasonableSuspicion &&
                    !msg.eduDiscipline &&
                    !msg.trafficViolation &&
                    !msg.reasonableSuspicion &&
                    !msg.reasonBrief ? msg.errorFlag = false : null;
                break;
            case '4':
                if (this.state.stop.Person_Stopped.actionsTakenDuringStop.length < 1) {
                    msg.action = '*Please make a selection for Actions Taken During Stop'
                    msg.errorFlag = true;
                } else {
                    msg.action = '';
                    if (this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf('Search of person was conducted') > -1 || this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf('Search of property was conducted') > -1) {
                        if (this.state.stop.Person_Stopped.basisForSearch.length < 1) {
                            msg.searchBasis = '*Please make a selection for Basis for search'
                            msg.errorFlag = true;
                        } else { msg.searchBasis = '' }
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

                if (this.state.stop.Person_Stopped.basisForSearchBrief.length < 5 || this.state.stop.Person_Stopped.basisForSearchBrief.length > 250) {
                    msg.searchBrief = '*Please provide a brief explanation regarding the reason for the stop (at least 5 and less than 250 characters)'
                    msg.errorFlag = true;
                } else { msg.searchBrief = '' }

                if (this.state.stop.Person_Stopped.resultOfStop.length < 1) {
                    msg.result = '*Please make a selection for Result of Stop'
                    msg.errorFlag = true;
                } else {
                    msg.result = '';
                }

                if (this.state.stop.Person_Stopped.resultOfStop.length > 0) {
                    if (this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(2) > -1) {
                        if (this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(2)].codes.length < 1) {
                            msg.result = '*Please add Vehicle/Penal Code section'
                            msg.errorFlag = true;
                        } else { msg.result = ''; }
                    }
                }

                if (this.state.stop.Person_Stopped.resultOfStop.length > 0) {
                    if (this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(3) > -1) {
                        if (this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(3)].codes.length < 1) {
                            msg.result = '*Please add Vehicle/Penal Code section'
                            msg.errorFlag = true;
                        } else { msg.result = ''; }
                    }
                }
                if (this.state.stop.Person_Stopped.resultOfStop.length > 0) {
                    if (this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(4) > -1) {
                        if (this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(4)].codes.length < 1) {
                            msg.result = '*Please add Vehicle/Penal Code section'
                            msg.errorFlag = true;
                        } else { msg.result = ''; }
                    }
                }
                if (this.state.stop.Person_Stopped.resultOfStop.length > 0) {
                    if (this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(6) > -1) {
                        if (this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.key; }).indexOf(6)].codes.length < 1) {
                            msg.result = '*Please add Vehicle/Penal Code section'
                            msg.errorFlag = true;
                        } else { msg.result = ''; }
                    }
                }

                if (this.state.stop.Person_Stopped.contrabandOrEvidenceDiscovered.length < 1) {
                    msg.contraband = '*Please make a selection for Contraband or Evidence Discovered'
                    msg.errorFlag = true;
                } else {
                    msg.contraband = '';
                }

                this.state.stop.Person_Stopped.actionsTakenDuringStop.length > 0 &&
                    this.state.stop.Person_Stopped.resultOfStop.length > 0 &&
                    this.state.stop.Person_Stopped.contrabandOrEvidenceDiscovered.length > 0 &&

                    !msg.searchBasis &&
                    !msg.seizureBasis &&
                    !msg.seizureProperty &&
                    !msg.searchBrief
                !msg.result
                    ? msg.errorFlag = false : null;
                break;
            case '5':

                break;
        }
        this.setState({ validationErrorMsg: msg });

    }
    componentWillMount() {

        //Defer load?
        //this.fetchCodes('/api/', 'CJISOffenseCodes','&type=PC&sectype=HS', 'PC'); //combine HS & PC
        //this.fetchCodes('/api/', 'CJISOffenseCodes', '&type=VC&sectype=', 'VC');
        this.fetchCodes('/api/', 'CJISOffenseCodes', '', 'AllCodes');
        this.fetchCodes('/api/', 'Schools', '&type=San Diego', 'Schools');

        //load on mount
        this.fetchCodes('/api/', 'Cities', '', 'Cities')

        //load education subdivisions
        var codenode = this.state.codes;
        codenode['EC'] = EC_Subdivision;
        this.setState({ codes: codenode });

        //store.set('test', this.state.codes.VC);       

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
                            if (label != 'Cities') {
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
        codenode[label] = json;
        this.setState({ codes: codenode });
        //alert(JSON.stringify(json));
        //if (!store.enabled) {
        //if (!localStorage.storageAvailable()) {
        //    alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
        //    return
        //}        
        //store.set(label, this.state.codes[label]);
        localStorage.setItem(label, JSON.stringify(this.state.codes[label]));
    }
    setStopInProgress() {
        localStorage.removeItem('stopInProgress');
        //store.remove('stopInProgress');
        //store.set('stopInProgress', {
        //    stop: this.state.stop,
        //    instrumentation: this.state.instrumentation,
        //    formPartFilter: this.state.formPartFilter,
        //    progress: this.state.progress,
        //    latitude: this.state.latitude,
        //    longitude: this.state.longitude,
        //    beat: this.state.beat
        //})
        localStorage.setItem('stopInProgress', JSON.stringify({
            stop: this.state.stop,
            instrumentation: this.state.instrumentation,
            formPartFilter: this.state.formPartFilter,
            progress: this.state.progress,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            beat: this.state.beat
        }));
        // console.log(store.get('stopInProgress'));
        // console.log(localStorage.getItem('stopInProgress'));
        // e.preventDefault();
    }
    cancelStopInProgress(e) {
        if (confirm('Are you sure you want to cancel this Stop?')) {
            ///store.remove('stopInProgress');
            localStorage.removeItem('stopInProgress')
        }
    };
    // update stop progress cache with every update
    componentDidUpdate() {
        if (this.state.formPartFilter < '6' && this.state.formPartFilter > '0') {
            this.setStopInProgress();
        } else {
            //store.remove('stopInProgress');
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

        // check if active cache exists, if so, mount the cache
        //if (store.get('stopInProgress')) {
        //    stop = store.get('stopInProgress').stop;
        //    instrumentation = store.get('stopInProgress').instrumentation;
        //    instrumentation.cacheFlag = true;
        //    formPartFilter = store.get('stopInProgress').formPartFilter;
        //    progress = store.get('stopInProgress').progress;
        //    latitude = store.get('stopInProgress').latitude;
        //    longitude = store.get('stopInProgress').longitude;
        //    beat = store.get('stopInProgress').beat;
        if (localStorage.getItem('stopInProgress')) {
            var stopInProgress = JSON.parse(localStorage.getItem('stopInProgress'));
            stop = stopInProgress.stop;
            instrumentation = stopInProgress.instrumentation;
            instrumentation.cacheFlag = true;
            formPartFilter = stopInProgress.formPartFilter;
            progress = stopInProgress.progress;
            latitude = stopInProgress.latitude;
            longitude = stopInProgress.longitude;
            beat = stopInProgress.beat;
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
        }

        this.setState({
            stop: stop,
            instrumentation: instrumentation,
            formPartFilter: formPartFilter,
            progress: progress,
            latitude: latitude,
            longitude: longitude,
            beat: beat,
            debug: document.getElementById('debug').innerHTML,
            reverseGeoURI: document.getElementById('reverseGeoURI').innerText
        });
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

        if (node == 'schoolName' || node == 'city') {
            var arr = this.state.stop.location[node][node2].slice();
            arr.splice(e, 1);
        } else if (node == 'reasonForStop') {
            var arr = this.state.stop.Person_Stopped[node][node2];
            arr.splice(e, 1);
        } else {
            var arr = this.state.stop.Person_Stopped[node].slice();
            var i = arr.map(function (x) { return x[node3]; }).indexOf(node3v);
            arr[i]['codes'].splice(e, 1);
        }

        //get nested node (i.e. details)
        //var i = arr.map(function (x) { return x[node3]; }).indexOf(node3v);


        if (node == 'schoolName' || node == 'city') {
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
        } else if (node == 'reasonForStop') {
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
        if (node == 'schoolName' || node == 'city') {
            var arr = this.state.stop.location[node];
            var ii = arr['codes'].map(function (x) { return x['text']; }).indexOf(tag);

        } else if (node == 'reasonForStop') {
            var arr = this.state.stop.Person_Stopped[node];
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
            if (node == 'reasonForStop' || node == 'schoolName') {
                if (arr['codes'].length < 1) {
                    arr['codes'].push({
                        code: tag.split(' ').pop(),
                        //text: tag.substr(0, tag.lastIndexOf(' '))
                        text: tag
                    });
                }
            } else if (node == 'city') {
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

            if (node == 'schoolName' || node == 'city') {
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
                            <a href="" className="button-left button-cancel" title="" name="" onClick={this.clearStore} >Refresh Cache</a>

                        </div>
                    </div>
                }
                {this.state.formPartFilter === "1" &&
                    <div className="list-section">
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5
                        </p>

                        {this.state.validationErrorMsg.assignment && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.assignment}</div>}
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
                            </div>
                        }

                        <h3>Date Of Stop</h3>
                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-2">§999.226(a)(2)</a>
                        {this.state.validationErrorMsg.datetime && <div className="error-alert"> {this.state.validationErrorMsg.datetime}</div>}
                        <TextInput type="date" max={this.state.instrumentation.temporalTrace.startDate} stateValue={this.state.stop.date} className="list-item" label="Date" name="date" onChange={this.updateDateTime} required />
                        {this.state.validationErrorMsg.time && <div className="error-alert"> {this.state.validationErrorMsg.time}</div>}
                        <TextInput type="time" max={this.state.instrumentation.temporalTrace.startTime} stateValue={this.state.stop.time} className="list-item" label="Time" name="time" onChange={this.updateDateTime} />


                        {this.state.validationErrorMsg.duration && <div className="error-alert"> {this.state.validationErrorMsg.duration}</div>}
                        <TextInput type="number" min='0' stateValue={this.state.stop.stopDuration} className="list-item" label="Duration of Stop (in Minutes)" name="stopDuration" pattern="\d*" onChange={this.updateDateTime} />


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
                        <div className='button-container'>
                            <a href="" className="button-left" value="LastLocation" name="lastLocation" onClick={this.useLastLocation} > Use my last location</a>
                            <a href="" className="button-right" value="Get Lat/Long" name="GPS" onClick={this.geoFindMe} > Look up my location </a>
                        </div>
                        {this.state.validationErrorMsg.block && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.block}</div>}
                        <TextInput type="number" pattern="\d*" min="0" stateValue={this.state.stop.location.blockNumber} name="blockNumber" className="list-item" label="Block Number:" onChange={this.updateLocation} />
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

                        <div className="text-field-view" >
                            <label className="list-item" >City:</label>
                            <Tags tags={this.state.stop.location.city.codes} className='list-item'
                                suggestions={this.state.codes.Cities}
                                autofocus={false}
                                allowDeleteFromEmptyInput={false}
                                placeholder='Add City'
                                classNames={{ tags: 'ReactTags__tags_unnested' }}
                                handleDelete={(e) => this.handleCodeDelete(e, 'city', 'codes')}
                                handleAddition={(e) => this.handleCodeAdd(e, 'city', 'Cities')} />
                        </div>
                        {this.state.validationErrorMsg.errorFlag && <div className="error-summary error-flip-margin ">Oops, you may have missed something! Please review your selections above.</div>}
                        <div className="button-container">
                            <a href="" className="button-left button-cancel" title="Cancel" name="" onClick={(e) => this.cancelStopInProgress(e)} > Cancel </a>
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
                                <h3>Perceived Race or Ethnicity</h3>
                                <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-4">§999.226(a)(4)</a>
                                {this.state.validationErrorMsg.race && <div className="error-alert"> {this.state.validationErrorMsg.race} </div>}
                                <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.perceivedRace} node='perceivedRace' node2='race' itemList={perceivedRace} function={this.checkBoxSelection} />
                            </div>
                        }
                        <h3>Perceived Gender</h3>
                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-5">§999.226(a)(5)</a>
                        {this.state.validationErrorMsg.gender && <div className="error-alert"> {this.state.validationErrorMsg.gender}</div>}
                        <RadioButtonListSection stateValue={this.state.stop.Person_Stopped.perceivedGender} node='perceivedGender' itemList={perceivedGender} function={this.radioSelection} />
                        <CheckBox2 key="genderNonconforming" className="list-item" checked={this.state.stop.Person_Stopped.genderNonconforming} value="Gender nonconforming" name="Gender nonconforming" onClick={(e) => this.updateBoolCheckBox(e, 'Person_Stopped', 'genderNonconforming')} />

                        <h3>Perceived LGBT</h3>
                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-6">§999.226(a)(6)</a>
                        {this.state.validationErrorMsg.lgbt && <div className="error-alert"> {this.state.validationErrorMsg.lgbt}</div>}
                        <RadioButton className="list-item" stateValue={this.state.stop.Person_Stopped.perceivedLgbt} value="Yes" name="Yes" onClick={(e) => this.radioSelection(e, 'perceivedLgbt')} />
                        {(this.state.stop.Person_Stopped.perceivedGender !== "Transgender man/boy" && this.state.stop.Person_Stopped.perceivedGender !== "Transgender woman/girl") &&
                            <RadioButton className="list-item" stateValue={this.state.stop.Person_Stopped.perceivedLgbt} value="No" name="No" onClick={(e) => this.radioSelection(e, 'perceivedLgbt')} />
                        }
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

                        {this.state.validationErrorMsg.errorFlag && <div className="error-summary error-flip-margin ">Oops, you may have missed something! Please review your selections above.</div>}
                        <div className="button-container">
                            <a href="" className="button-left" title="<< Back" name="1" onClick={(e) => this.handleFormSectionFilter(e)} > Back </a>
                            <a href="" className="button-left button-cancel" title="Cancel" name="" onClick={(e) => this.cancelStopInProgress(e)} > Cancel </a>
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
                        {this.state.personCount > 1 &&
                            <div className="button-container">
                                <a href="" className="button-right" title="Next >>" name="2" onClick={(e) => this.pullForwardPerson(e)} ><span> Pull forward from previous Person</span> </a>
                            </div>

                        }
                        <h3>Reasons For Stop</h3>
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
                                    placeholder='Add Vehicle Code'
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
                                    placeholder='Add Penal Code'
                                    autofocus={false}
                                    allowDeleteFromEmptyInput={false}
                                    handleDelete={(e) => this.handleCodeDelete(e, 'reasonForStop', 'codes')}
                                    handleAddition={(e) => this.handleCodeAdd(e, 'reasonForStop', 'AllCodes')}
                                    handleFilterSuggestions={this.handleFilterSuggestions} />
                                <label className="list-item-nested"> Select 1 Offense Code (required)</label>

                            </div>
                        }
                        <RadioButtonListSection checked={this.state.stop.Person_Stopped.reasonForStop.reason} stateValue={this.state.stop.Person_Stopped.reasonForStop.reason} node="reasonForStop" node2="reason" node2b="details" itemList={reasonsForStop_3} function={this.radioSelection} />
                        <p><strong> - and - </strong></p>
                        {this.state.validationErrorMsg.reasonBrief && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.reasonBrief}</div>}
                        <TextInput type="text" stateValue={this.state.stop.Person_Stopped.reasonForStopExplanation} className="list-item" label="Brief Explanation. Important: Do not include personally identifying information." name="reasonForStopExplanation" onChange={this.updatePersonInput} />
                        <span>{250 - this.state.stop.Person_Stopped.reasonForStopExplanation.length} characters remaining</span>

                        {this.state.validationErrorMsg.errorFlag &&
                            <div className="error-summary error-flip-margin"> Oops, you may have missed something! Please review your selections above.</div>}
                        <div className="button-container">
                            <a href="" className="button-left" title="<< Back" name="2" onClick={(e) => this.handleFormSectionFilter(e)} > Back </a>
                            <a href="" className="button-left button-cancel" title="Cancel" name="" onClick={(e) => this.cancelStopInProgress(e)} > Cancel </a>
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
                        <CheckBox2 key="None" className="list-item" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("None") > -1} value="None" name="None" onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '24,na')} />
                        {this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (y) { return y.action }).indexOf("None") == -1 &&
                            <div>

                                {this.state.stop.location.school && this.state.stop.Person_Stopped.Is_Stud &&
                                    <CheckBox2 key="Admission or written statement obtained from student" className="list-item" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Admission or written statement obtained from student") > -1} value="Admission or written statement obtained from student" name="Admission or written statement obtained from student" onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '23,na')} />
                                }
                                <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.actionsTakenDuringStop} node="actionsTakenDuringStop" node2="action" node2b="details" itemList={actionsTakenDuringStop_1} function={this.checkBoxSelection} />


                                <CheckBox2 key="Vehicle impounded" className="list-item" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Vehicle impounded") > -1} value="Vehicle impounded" name="Vehicle impounded" onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '22,na')} />

                                <p><strong>Search</strong></p>
                                <CheckBox2 key="Asked for consent to search person" className="list-item" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search person") > -1} value="Asked for consent to search person" name="Asked for consent to search person" onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '17,N')} />
                                {this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search person") > -1 &&
                                    <CheckBox2 key="personSearchConsentGiven" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop[this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search person")].personSearchConsentGiven} className="list-item-nested" value="Person Search Consent Given" name="personSearchConsentGiven" onClick={(e) => this.searchConsentGiven(e)} />
                                }
                                <CheckBox2 key="Search of person was conducted" className="list-item" checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted") > -1} value="Search of person was conducted" name="Search of person was conducted" onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '18,na')} />

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
                                <CheckBox2
                                    key="Search of property was conducted"
                                    className="list-item"
                                    checked={this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of property was conducted") > -1}
                                    value="Search of property was conducted"
                                    name="Search of property was conducted"
                                    onClick={(e) => this.checkBoxSelection(e, 'actionsTakenDuringStop', 'action', 'details', '20,na')} />
                                {(this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted") > -1 || this.state.stop.Person_Stopped.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of property was conducted") > -1) &&
                                    <div>

                                        <h4 className="">Basis for Search </h4>
                                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-12-b">§999.226(a)(12)(B)</a>
                                        {this.state.validationErrorMsg.searchBasis && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.searchBasis}</div>}


                                        {this.state.stop.location.school && this.state.stop.Person_Stopped.Is_Stud &&
                                            <CheckBox2 key="Suspected violation of school policy" checked={this.state.stop.Person_Stopped.basisForSearch.map(function (y) { return y.basis }).indexOf("Suspected violation of school policy") > -1} className="list-item-nested" value="Suspected violation of school policy" name="Suspected violation of school policy" onClick={(e) => this.checkBoxSelection(e, 'basisForSearch', 'basis', '', 13)} />
                                        }
                                        <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.basisForSearch} itemList={searchOfPersonOrPropertyConducted} node="basisForSearch" node2="basis" function={this.checkBoxSelection} />

                                        {this.state.validationErrorMsg.searchBrief && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.searchBrief}</div>}
                                        <TextInput type="text" stateValue={this.state.stop.Person_Stopped.basisForSearchBrief} className="list-item-nested" label="Brief Explanation (250 characters). Important: Do not include personally identifying information." name="basisForSearchBrief" onChange={this.updatePersonInput} />
                                        <span className="list-item-nested">{250 - this.state.stop.Person_Stopped.basisForSearchBrief.length}  characters remaining</span>
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
                        <CheckBox2 key="None1" className="list-item" checked={this.state.stop.Person_Stopped.contrabandOrEvidenceDiscovered.map(function (x) { return x.contraband; }).indexOf("None") > -1} value="None" name="None" onClick={(e) => this.checkBoxSelection(e, 'contrabandOrEvidenceDiscovered', 'contraband', '', 1)} />
                        {this.state.stop.Person_Stopped.contrabandOrEvidenceDiscovered.map(function (y) { return y.contraband }).indexOf("None") == -1 &&
                            <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.contrabandOrEvidenceDiscovered} itemList={contrabandOrEvidence} node="contrabandOrEvidenceDiscovered" node2="contraband" function={this.checkBoxSelection} />
                        }

                        <h3>Result of Stop </h3>
                        <span className='required'>required</span><a className="required regref" target="_blank" href="/regulation#999-226-a-13">§999.226(a)(13)</a>
                        {this.state.validationErrorMsg.result && <div className="error-alert error-flip-margin"> {this.state.validationErrorMsg.result}</div>}

                        <CheckBox2 key="No Action" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("No Action") > -1} value="No Action" name="No Action" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 1)} />
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
                                        <Tags tags={this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (y) { return y.result }).indexOf("Warning (verbal or written)")].codes}
                                            suggestions={this.state.codes.AllCodes}
                                            placeholder='Add Vehicle Code'
                                            autofocus={false}
                                            allowDeleteFromEmptyInput={false}
                                            handleDelete={(e) => this.handleCodeDelete(e, 'resultOfStop', '', 'result', 'Warning (verbal or written)')}
                                            handleAddition={(e) => this.handleCodeAdd(e, '', 'AllCodes', 'resultOfStop', 'result', 'Warning (verbal or written)')}
                                            handleFilterSuggestions={this.handleFilterSuggestions} />

                                        <label className="list-item-nested"> Select Offense Code (up to 5)</label>
                                    </div>
                                }
                                <CheckBox2 key="Citation or infraction" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Citation or infraction") > -1} value="Citation or infraction" name="Citation or infraction" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 3)} />
                                {this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Citation or infraction") > -1 &&
                                    <div>
                                        <Tags tags={this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (y) { return y.result }).indexOf("Citation or infraction")].codes}

                                            placeholder='Add Vehicle Code'
                                            autofocus={false}
                                            allowDeleteFromEmptyInput={false}
                                            handleFilterSuggestions={this.handleFilterSuggestions} />

                                        <label className="list-item-nested"> Select Offense Code (up to 5)</label>
                                    </div>
                                }
                                <CheckBox2 key="In-field cite and release" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("In-field cite and release") > -1} value="In-field cite and release" name="In-field cite and release" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 4)} />
                                {this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("In-field cite and release") > -1 &&
                                    <div>
                                        <Tags tags={this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (y) { return y.result }).indexOf("In-field cite and release")].codes}
                                            suggestions={this.state.codes.AllCodes}
                                            placeholder='Add Vehicle Code'
                                            autofocus={false}
                                            allowDeleteFromEmptyInput={false}
                                            handleDelete={(e) => this.handleCodeDelete(e, 'resultOfStop', '', 'result', 'In-field cite and release')}
                                            handleAddition={(e) => this.handleCodeAdd(e, '', 'AllCodes', 'resultOfStop', 'result', 'In-field cite and release')}
                                            handleFilterSuggestions={this.handleFilterSuggestions} />

                                        <label className="list-item-nested"> Select Offense Code (up to 5)</label>
                                    </div>
                                }
                                <CheckBox2 key="Custodial Arrest pursuant to outstanding warrant" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Custodial Arrest pursuant to outstanding warrant") > -1} value="Custodial Arrest pursuant to outstanding warrant" name="Custodial Arrest pursuant to outstanding warrant" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 5)} />
                                <CheckBox2 key="Custodial Arrest without warrant" className="list-item" checked={this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Custodial Arrest without warrant") > -1} value="Custodial Arrest without warrant" name="Custodial Arrest without warrant" onClick={(e) => this.checkBoxSelection(e, 'resultOfStop', 'result', '', 6)} />
                                {this.state.stop.Person_Stopped.resultOfStop.map(function (x) { return x.result; }).indexOf("Custodial Arrest without warrant") > -1 &&
                                    <div>
                                        <Tags tags={this.state.stop.Person_Stopped.resultOfStop[this.state.stop.Person_Stopped.resultOfStop.map(function (y) { return y.result }).indexOf("Custodial Arrest without warrant")].codes}
                                            suggestions={this.state.codes.AllCodes}
                                            placeholder='Add Vehicle Code'
                                            autofocus={false}
                                            allowDeleteFromEmptyInput={false}
                                            handleDelete={(e) => this.handleCodeDelete(e, 'resultOfStop', '', 'result', 'Custodial Arrest without warrant')}
                                            handleAddition={(e) => this.handleCodeAdd(e, '', 'AllCodes', 'resultOfStop', 'result', 'Custodial Arrest without warrant')}
                                            handleFilterSuggestions={this.handleFilterSuggestions} />

                                        <label className="list-item-nested">Select  Offense Code (up to 5)</label>
                                    </div>
                                }
                                <CheckBoxListSection type="CheckBox" stateValue={this.state.stop.Person_Stopped.resultOfStop} node="resultOfStop" node2="result" node2b="details" itemList={resultOfStop} function={this.checkBoxSelection} />
                            </div>
                        }
                        <div className="text-field-view">

                        </div>
                        {this.state.validationErrorMsg.errorFlag && <div className="error-summary error-flip-margin ">Oops, you may have missed something! Please review your selections above.</div>}
                        <div className="button-container">
                            <a href="" className="button-left" title="<< Back" name="3" onClick={(e) => this.handleFormSectionFilter(e)} > Back </a>
                            <a href="" className="button-left button-cancel" title="Cancel" name="" onClick={(e) => this.cancelStopInProgress(e)} > Cancel </a>
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
                            <label>Person Count <pre>{this.state.personCount}</pre></label>
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
                                        {this.state.stop.location.city &&
                                            <ListValue className="" labelValue="City" stateValue={this.state.stop.location.city.codes[0].text} />
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

                        </div>

                        {/*<div id="stop"></div>*/}
                        <div className='button-container'>
                            <a href="" className="button-left" title="Add Person" onClick={this.addPerson} > + Add Person </a>
                        </div>
                        <div className="button-container">
                            <a href="" className="button-left" title="<< Back" name="4" onClick={(e) => this.handleFormSectionFilter(e)} > Back </a>
                            <a href="" className="button-left button-cancel" title="Cancel" name="" onClick={(e) => this.cancelStopInProgress(e)} > Cancel </a>
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
                <input value={this.props.stateValue} type={this.props.type} min={this.props.min} max={this.props.max} name={this.props.name} className={this.props.className} pattern={this.props.pattern} onChange={this.props.onChange} />
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
    { key: 11, value: "Exigent circumstances/emergency", className: "list-item-nested", onClick: "" },
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
    { key: 8, value: "Noncriminal transport or caretaking transport", className: "list-item", onClick: "" },
    { key: 9, value: "Contacted parent/legal guardian or other person responsible for the minor", className: "list-item", onClick: "" },
    { key: 10, value: "Psychiatric hold", className: "list-item", onClick: "" },
    { key: 11, value: "Contacted U.S. Department of Homeland Security", className: "list-item", onClick: "" }
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