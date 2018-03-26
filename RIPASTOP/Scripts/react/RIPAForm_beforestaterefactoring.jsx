

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ori: '',
            //date: new Date().toLocaleString(),
            date: '',
            time: '',
            location: {
                latitude: '',
                longitude: '',
                //isHome: false,
                crossStreets: '',
                intersection: '',
                blockNumber: '',
                roadMarker: '',
                landMark: '',
                zipCode: '',
                streetAddress: '',
                highwayExit: '',
                //other: '',
                //isSchool: false,
                schoolName: '',
                Student: false,
                locationType: ''
            },
            stopType: '',
            stopDuration: '',
            perceivedRace: [],
            perceivedOrKnownDisability: [],
            perceivedAge: '',
            perceivedGender: '',
            reasonsForPresenceAtScene: [],
            // radioDispatch: [],
            plannedOperation: [],
            reasonForStop: [],
            //trafficViolation: [],
            //reasonableSuspicion: [],
            actionsTakenDuringStop: [],
            //weaponBrandished: [],
            //weaponDischarched: [],
            //basisForPersonSearch: [],
            //contrabandOrEvidenceDiscovered: [],
            //basisForPropertySearch: [],
            //basisForPropertySeizure: [],
            //typeOfPropertySeized: [],
            resultOfStop: [],
            //custodyDetails: [],
            officerYearsExperience: '',
            officerAssignment: { type: '', otherType: ''},
            progress: 10,
            formPartFilter: '1',
            codes: {},
            code: ''
        };
        this.stopTypeSelection = this.stopTypeSelection.bind(this);
        this.stopDurationSelection = this.stopDurationSelection.bind(this);
        this.perceivedRaceSelection = this.perceivedRaceSelection.bind(this);
        this.perceivedAgeSelection = this.perceivedAgeSelection.bind(this);
        this.perceivedGenderSelection = this.perceivedGenderSelection.bind(this);
        this.reasonsForPresenceAtSceneSelection = this.reasonsForPresenceAtSceneSelection.bind(this);
        this.radioDispatchSelection = this.radioDispatchSelection.bind(this);
        this.plannedOperationSelection = this.plannedOperationSelection.bind(this);
        this.reasonsForStopSelection = this.reasonsForStopSelection.bind(this);
        this.perceivedOrKnowDisabilitySelection = this.perceivedOrKnowDisabilitySelection.bind(this);
        this.actionsTakenDuringStopSelection = this.actionsTakenDuringStopSelection.bind(this);
        this.weaponBrandishedSelection = this.weaponBrandishedSelection.bind(this);
        this.weaponDischarchedSelection = this.weaponDischarchedSelection.bind(this);
        this.basisForPersonSearchSelection = this.basisForPersonSearchSelection.bind(this);
        this.contrabandOrEvidenceDiscoveredSelection = this.contrabandOrEvidenceDiscoveredSelection.bind(this);
        this.basisForPropertySearchSelection = this.basisForPropertySearchSelection.bind(this);
        this.basisForPropertySeizureSelection = this.basisForPropertySeizureSelection.bind(this);
        this.typeOfPropertySeizedSelection = this.typeOfPropertySeizedSelection.bind(this);
        this.resultOfStopSelection = this.resultOfStopSelection.bind(this);
        this.custodyDetailsSelection = this.custodyDetailsSelection.bind(this);
        this.officerAssignmentSelection = this.officerAssignmentSelection.bind(this);
        this.officerYearsExperienceSelection = this.officerYearsExperienceSelection.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.updateLocationType = this.updateLocationType.bind(this);
        this.updateAmount = this.updateAmount.bind(this);
        this.updateDateTime = this.updateDateTime.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.warningTypeSelection = this.warningTypeSelection.bind(this);

        this.handleFormSectionFilter = this.handleFormSectionFilter.bind(this);
        this.geoFindMe = this.geoFindMe.bind(this);
        this.geoSuccess = this.geoSuccess.bind(this);

        this.handleCodes = this.handleCodes.bind(this);
        this.guid = this.guid.bind(this);
    }

    stopTypeSelection(e) {
        var val = e.target.value;
        this.setState({ stopType: val });
    }
    stopDurationSelection(e) {
        var val = e.target.value;
        this.setState({ stopDuration: val });
    }
    perceivedAgeSelection(e) {
        var val = e.target.value;
        this.setState({ perceivedAge: val });
    }
    perceivedGenderSelection(e) {
        var val = e.target.value;
        this.setState({ perceivedGender: val });
    }
    officerYearsExperienceSelection(e) {
        var val = e.target.value;
        this.setState({ officerYearsExperience: val });
    }
    officerAssignmentSelection(e) {
        var val = e.target.value;
        var name = e.target.name;
        var newState = name == "otherType" ? { type: "Other", otherType: val } : { type: val, otherType: "" }
        this.setState({ officerAssignment: newState });
    }
    perceivedRaceSelection(e) {
        var val = e.target.value;
        var arr = this.state.perceivedRace.slice();
        var props = props;
        //var index = Race.findIndex(x => x.race === e.target.value); //No IE Support
        var i = arr.map(function (x) { return x.race; }).indexOf(val);

        if (i === -1) {
            arr.push({ race: val });
            this.setState({ perceivedRace: arr });
        } else {
            arr.splice(i, 1);
            this.setState({ perceivedRace: arr });
        }
        
    }
    perceivedOrKnowDisabilitySelection(e) {
        var val = e.target.value;
        var arr = this.state.perceivedOrKnownDisability.slice();
        var i = arr.map(function (x) { return x.disability; }).indexOf(val);

        if (i === -1) {
            arr.push({ disability: val });
            this.setState({ perceivedOrKnownDisability: arr });
        } else {
            arr.splice(i, 1);
            this.setState({ perceivedOrKnownDisability: arr });
        }
    }
    reasonsForPresenceAtSceneSelection(e) {
        var val = e.target.value;
        var arr = this.state.reasonsForPresenceAtScene.slice();
        var i = arr.map(function (x) { return x.reason; }).indexOf(val);

        if (i === -1) {
            arr.push({ reason: val, details: [] });
            this.setState({ reasonsForPresenceAtScene: arr });
        } else {
            arr.splice(i, 1);
            this.setState({ reasonsForPresenceAtScene: arr });
        }
    }
    radioDispatchSelection(e) {
        var val = e.target.value;
        // use the parent arry
        var arr = this.state.reasonsForPresenceAtScene.slice();
        // index of parent
        var i = arr.map(function (x) { return x.reason; }).indexOf('Radio Dispatch');
        // index of child
        var ii = arr[i].details.map(function (x) { return x.detail; }).indexOf(val);

        // check if not already in array
        if (ii === -1) {
            // add new detail to parent
            arr[i].details.push({ detail: val });
            // update state of parent
            this.setState({ reasonsForPresenceAtScene: arr });
        }
        else {
            // yank if it already exists
            arr[i].details.splice(ii, 1);
            // update state of parent
            this.setState({ reasonsForPresenceAtScene: arr });
        }
    }
    plannedOperationSelection(e) {
        var val = e.target.value;
        // use the parent arry
        var arr = this.state.reasonsForPresenceAtScene.slice();
        // index of parent
        var i = arr.map(function (x) { return x.reason; }).indexOf('Planned Operation');
        // index of child
        var ii = arr[i].details.map(function (x) { return x.detail; }).indexOf(val);

        // check if not already in array
        if (ii === -1) {
            // add new detail to parent
            arr[i].details.push({ detail: val });
            // update state of parent
            this.setState({ reasonsForPresenceAtScene: arr });
        }
        else {
            // yank if it already exists
            arr[i].details.splice(ii, 1);
            // update state of parent
            this.setState({ reasonsForPresenceAtScene: arr });
        }
    }
    reasonsForStopSelection(e) {
        var val = e.target.value;
        var arr = this.state.reasonForStop.slice();
        var i = arr.map(function (x) { return x.reason; }).indexOf(val);

        if (i === -1) {
            arr.push({ reason: val, details: [] });
            this.setState({ reasonForStop: arr });
        } else {
            arr.splice(i, 1);
            this.setState({ reasonForStop: arr });
        }
    }
    trafficViolationSelection(e) {
        var val = e.target.value;
        // use the parent arry
        var arr = this.state.reasonForStop.slice();
        // index of parent
        var i = arr.map(function (x) { return x.reason; }).indexOf('Traffic Violation');
        // index of child
        var ii = arr[i].details.map(function (x) { return x.reason; }).indexOf(val);

        // check if not already in array
        if (ii === -1) {
            // add new detail to parent
            arr[i].details.push({ reason: val, codesection: '', subdivision: '' });
            // update state of parent
            this.setState({ reasonForStop: arr });
        }
        else {
            // yank if it already exists
            arr[i].details.splice(ii, 1);
            // update state of parent
            this.setState({ reasonForStop: arr });
        }
    }
    reasonableSuspicionSelection(e) {
        var val = e.target.value;
        // use the parent arry
        var arr = this.state.reasonForStop.slice();
        // index of parent
        var i = arr.map(function (x) { return x.reason; }).indexOf('Reasonable Suspicion');
        // index of child
        var ii = arr[i].details.map(function (x) { return x.reason; }).indexOf(val);

        // check if not already in array
        if (ii === -1) {
            // add new detail to parent
            arr[i].details.push({ reason: val, codesection: '', subdivision: '' });
            // update state of parent
            this.setState({ reasonForStop: arr });
        }
        else {
            // yank if it already exists
            arr[i].details.splice(ii, 1);
            // update state of parent
            this.setState({ reasonForStop: arr });
        }
    }
    actionsTakenDuringStopSelection(e) {
        var val = e.target.value;
        var arr = this.state.actionsTakenDuringStop.slice();
        var i = arr.map(function (x) { return x.action; }).indexOf(val);

        if (i === -1) {
            arr.push({ action: val, details: [], personSearchConsentGiven: false, basisForSearch: [], contrabandOrEvidenceDiscovered: [], propertySearchConsentGiven: false, basisForPropertySeizure: [], typeOfPropertySeized: [] });
            this.setState({ actionsTakenDuringStop: arr });
        } else {
            arr.splice(i, 1);
            this.setState({ actionsTakenDuringStop: arr });
        }
    }
    searchConsentGiven(e) {
        var val = e.target.value;
        var arr = this.state.actionsTakenDuringStop.slice();

        if (val === 'Property Search Consent Given') {
            val = e.target.checked ? true : false;
            var i = arr.map(function (x) { return x.action; }).indexOf('Asked for consent to search property');
            arr[i].propertySearchConsentGiven = val;
        }
        else if (val === 'Person Search Consent Given') {
            val = e.target.checked ? true : false;
            var i = arr.map(function (x) { return x.action; }).indexOf('Asked for consent to search person');
            arr[i].personSearchConsentGiven = val;
        }

        this.setState({ actionsTakenDuringStop: arr })
    }
    weaponBrandishedSelection(e) {
        var val = e.target.value;
        // use the parent arry
        var arr = this.state.actionsTakenDuringStop.slice();
        // index of parent
        var i = arr.map(function (x) { return x.action; }).indexOf('Weapon removed from holster or brandished');
        // index of child
        var ii = arr[i].details.map(function (x) { return x.detail; }).indexOf(val);

        // check if not already in array
        if (ii === -1) {
            // add new detail to parent
            arr[i].details.push({ detail: val});
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }
        else {
            // yank if it already exists
            arr[i].details.splice(ii, 1);
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }
    }
    weaponDischarchedSelection(e) {
        var val = e.target.value;
        // use the parent arry
        var arr = this.state.actionsTakenDuringStop.slice();
        // index of parent
        var i = arr.map(function (x) { return x.action; }).indexOf('Weapon was discharged or used');
        // index of child
        var ii = arr[i].details.map(function (x) { return x.detail; }).indexOf(val);

        // check if not already in array
        if (ii === -1) {
            // add new detail to parent
            arr[i].details.push({ detail: val });
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }
        else {
            // yank if it already exists
            arr[i].details.splice(ii, 1);
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }
    }
    basisForPersonSearchSelection(e) {

        var val = e.target.value;
        // use the parent arry
        var arr = this.state.actionsTakenDuringStop.slice();
        // index of parent
        var i = arr.map(function (x) { return x.action; }).indexOf('Search of person was conducted');
        // index of child
        var ii = arr[i].basisForSearch.map(function (x) { return x.basis; }).indexOf(val);

        // check if not already in array
        if (ii === -1) {
            // add new detail to parent
            arr[i].basisForSearch.push({ basis: val });
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }
        else {
            // yank if it already exists
            arr[i].basisForSearch.splice(ii, 1);
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }

    }
    contrabandOrEvidenceDiscoveredSelection(e) {
        var val = e.target.value;
        // use the parent arry
        var arr = this.state.actionsTakenDuringStop.slice();
        // index of parent
        var i = arr.map(function (x) { return x.action; }).indexOf('Search of person was conducted');
        // index of child
        var ii = arr[i].contrabandOrEvidenceDiscovered.map(function (x) { return x.contraband; }).indexOf(val);

        // check if not already in array
        if (ii === -1) {
            // add new detail to parent
            arr[i].contrabandOrEvidenceDiscovered.push({ contraband: val, amount: 0 });
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }
        else {
            // yank if it already exists
            arr[i].contrabandOrEvidenceDiscovered.splice(ii, 1);
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }
    }
    basisForPropertySearchSelection(e) {
        var val = e.target.value;
        // use the parent arry
        var arr = this.state.actionsTakenDuringStop.slice();
        // index of parent
        var i = arr.map(function (x) { return x.action; }).indexOf('Search of property was conducted');
        // index of child
        var ii = arr[i].basisForSearch.map(function (x) { return x.basis; }).indexOf(val);

        // check if not already in array
        if (ii === -1) {
            // add new detail to parent
            arr[i].basisForSearch.push({ basis: val });
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }
        else {
            // yank if it already exists
            arr[i].basisForSearch.splice(ii, 1);
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }
    }
    basisForPropertySeizureSelection(e) {
        var val = e.target.value;
        // use the parent arry
        var arr = this.state.actionsTakenDuringStop.slice();
        // index of parent
        var i = arr.map(function (x) { return x.action; }).indexOf('Property was seized');
        // index of child
        var ii = arr[i].basisForPropertySeizure.map(function (x) { return x.basis; }).indexOf(val);

        // check if not already in array
        if (ii === -1) {
            // add new detail to parent
            arr[i].basisForPropertySeizure.push({ basis: val });
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }
        else {
            // yank if it already exists
            arr[i].basisForPropertySeizure.splice(ii, 1);
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }

    }
    typeOfPropertySeizedSelection(e) {
        var val = e.target.value;
        // use the parent arry
        var arr = this.state.actionsTakenDuringStop.slice();
        // index of parent
        var i = arr.map(function (x) { return x.action; }).indexOf('Property was seized');
        // index of child
        var ii = arr[i].typeOfPropertySeized.map(function (x) { return x.type; }).indexOf(val);

        // check if not already in array
        if (ii === -1) {
            // add new detail to parent
            arr[i].typeOfPropertySeized.push({ type: val, amount: 0 });
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }
        else {
            // yank if it already exists
            arr[i].typeOfPropertySeized.splice(ii, 1);
            // update state of parent
            this.setState({ actionsTakenDuringStop: arr });
        }
    }
    resultOfStopSelection(e) {
        var val = e.target.value;
        var arr = this.state.resultOfStop.slice();
        var i = arr.map(function (x) { return x.result; }).indexOf(val);

        if (i === -1) {
            arr.push({ result: val, isVerbalWarning: false, isWrittenWarning: false, codes: [{ codesection: '', subdivision: '' }], details: [] });
            this.setState({ resultOfStop: arr });
        } else {
            arr.splice(i, 1);
            this.setState({ resultOfStop: arr });
        }
    }
    warningTypeSelection(e) {
        var val = e.target.value;
        var arr = this.state.resultOfStop.slice();
        var i = arr.map(function (x) { return x.result; }).indexOf('Warning');

        if (val === 'Verbal Warning') {
            val = e.target.checked ? true : false;
            arr[i].isVerbalWarning = val;
        }
        else if (val === 'Written Warning') {
            val = e.target.checked ? true : false;
            arr[i].isWrittenWarning = val;
        }

        this.setState({ resultOfStop: arr })

    }
    custodyDetailsSelection(e) {
        var val = e.target.value;
        // use the parent arry
        var arr = this.state.resultOfStop.slice();
        // index of parent
        var i = arr.map(function (x) { return x.result; }).indexOf('Person taken into custody, referred to another agency, or transported');
        // index of child
        var ii = arr[i].details.map(function (x) { return x.detail; }).indexOf(val);

        // check if not already in array
        if (ii === -1) {
            // add new detail to parent
            arr[i].details.push({ detail: val });
            // update state of parent
            this.setState({ resultOfStop: arr });
        }
        else {
            // yank if it already exists
            arr[i].details.splice(ii, 1);
            // update state of parent
            this.setState({ resultOfStop: arr });
        }
    }
    updateAmount(e) {
        var val = e.target.value;
        var name = e.target.name;

        if (name === 'ContrabandAmount') {
            var arr = this.state.actionsTakenDuringStop.slice();
            var i = arr.map(function (x) { return x.action; }).indexOf('Search of person was conducted');
            var j = arr[i].contrabandOrEvidenceDiscovered.map(function (x) { return x.contraband; }).indexOf('Money');
            arr[i].contrabandOrEvidenceDiscovered[j].amount = val;
            this.setState({ actionsTakenDuringStop: arr });
        }
        else if (name === 'SeizedAmount') {
            var arr = this.state.actionsTakenDuringStop.slice();
            var i = arr.map(function (x) { return x.action; }).indexOf('Property was seized');
            var j = arr[i].typeOfPropertySeized.map(function (x) { return x.type; }).indexOf('Money');
            arr[i].typeOfPropertySeized[j].amount = val;
            this.setState({ actionsTakenDuringStop: arr });
        }

        this.setState({ actionsTakenDuringStop: arr });
    }
    updateLocation(e) {
        var val = e.target.value;

        if (val === 'Student') {
            val = e.target.checked ? true : false;
        }

        var name = e.target.name;
        var newLocation = this.state.location;
        newLocation[name] = val;
        this.setState({ location: newLocation });
    }
    updateLocationType(e) {
        var val = e.target.value;
        var newLocation = this.state.location;
        newLocation.locationType = val;
        newLocation.schoolName = val !== 'School' ? '' : newLocation.schoolName;
        newLocation.Student = val !== 'School' ? false : newLocation.Student;
        this.setState({ location: newLocation });
    }
    updateDateTime(e) {
        var val = e.target.value;
        var name = e.target.name;
        this.setState({ [name]: val});
    }
    geoSuccess(position) {        
        var newLocation = this.state.location;
        newLocation.latitude = position.coords.latitude;
        newLocation.longitude = position.coords.longitude;
        this.setState({ location: newLocation });
    } 
    geoFindMe(e) {
        if (!navigator.geolocation) {
            console.log("Geolocation is not supported by your browser");
            return;
        }      
        function error() {
            console.log("Unable to retrieve your location");
        }
        e.preventDefault();
        navigator.geolocation.getCurrentPosition(this.geoSuccess, error);
       
    }
    handleSubmit(e) { 
        this.geoFindMe(e);
        var progress = this.state.progress;
        progress = progress < 100 ? progress += 18 : progress;
        this.setState({ progress: progress, codes: null });
        
        console.log('The state of the state :D ' + JSON.stringify(this.state, null, 2));
        var uuid = this.guid();
        store.set('SH.Stop ' + uuid, this.state);

        e.preventDefault();
    }
    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    handleFormSectionFilter(e) {
        var val = e.target.name;
        var dir = e.target.value;
        var progress = this.state.progress;
        var step = this.state.formPartFilter
        if (dir === '<< Back') {
            if (step == 5 && progress == 100) {
                progress -= 36;
            }
            else {
                progress = progress > 9 ? progress -= 18 : progress;
            }
        } else {
            progress = progress < 100 ? progress += 18 : progress;
        }
        
        this.setState({ formPartFilter: val, progress: progress });
        scroll(0, 0);
        e.preventDefault();
    }
    componentWillMount() {

        if (store.get('SH.Codes')) {
            this.setState({ codes: store.get('SH.Codes') });
        } else {
            var thiss = this;
            var fetchedCodes = fetch('https://www.sdlaw.us/lookupapi/api/regionaloffensecodes?agency=SH&fragment=')
                .then(function (response) {
                    return response.json()
                        .then(function (json) {
                            console.log(json.map(function (x) { return x.OffenseCodeCombo; }))
                            thiss.handleCodes(json.map(function (x) { return x.OffenseCodeCombo; }));
                            return json;
                        });
                })
        }
    }
    handleCodes(json) {
        this.setState({ codes: json });
        store.set('SH.Codes', { json });
    }

    componentDidMount() {
        var date = moment().format('YYYY-MM-DD');
        var time = moment().format('HH:mm:ss');
        this.setState({ date: date, time: time });
    }

    render() {
        return (
            <form >
                {this.state.formPartFilter === "1" &&
                    <div className="list-section">
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5
                        </p>
                        
                        <h3>Date</h3>
                        
                        <TextInput type="date" stateValue={this.state.date} className="list-item" label="Date" name="date" onChange={this.updateDateTime} required />
                        <TextInput type="time" stateValue={this.state.time} className="list-item" label="Time" name="time" onChange={this.updateDateTime} />
                        <h3>Duration of Stop</h3>
                        <RadioButtonListSection stateValue={this.state.stopDuration} itemList={stopDuration} function={this.stopDurationSelection} />
                        <h3>Location</h3>
                        <RadioButton stateValue={this.state.location.locationType} className="list-item" value="School" onClick={this.updateLocationType} />
                        {this.state.location.locationType === "School" &&
                            <div>
                        <CheckBox key="Student" className="list-item-nested" checked={this.state.location.Student} value="Student" name="Student" onClick={this.updateLocation} />
                                <TextInput type="text" stateValue={this.state.location.schoolName} name="schoolName" className="list-item-nested" label="School Name:" onChange={this.updateLocation} />
                            </div>
                        }
                        <RadioButton stateValue={this.state.location.locationType} className="list-item" value="Home" onClick={this.updateLocationType} />
                        <RadioButton stateValue={this.state.location.locationType} className="list-item" value="Other" onClick={this.updateLocationType} />
                        <a href="" className="button-right" value="Get Lat/Long" name="GPS" onClick={this.geoFindMe} > Get Lat/Long </a>
                        <TextInput type="text" stateValue={this.state.location.streetAddress} name="streetAddress" className="list-item" label="Address:" onChange={this.updateLocation} />
                        <TextInput type="number" stateValue={this.state.location.zipCode} name="zipCode" className="list-item" label="ZIP:" onChange={this.updateLocation}  />
                        <TextInput type="text" stateValue={this.state.location.crossStreets} name="crossStreets" className="list-item" label="Cross Streets/Intersection:" onChange={this.updateLocation} />
                        <TextInput type="text" stateValue={this.state.location.blockNumber} name="blockNumber" className="list-item" label="Block Number:" onChange={this.updateLocation} />
                        <TextInput type="text" stateValue={this.state.location.roadMarker} name="roadMarker" className="list-item" label="Roadmarker:" onChange={this.updateLocation} />
                        <TextInput type="text" stateValue={this.state.location.highwayExit} name="highwayExit" className="list-item" label="Highway Exit:" onChange={this.updateLocation} />
                        <TextInput type="text" stateValue={this.state.location.landMark} name="landMark" className="list-item" label="Landmark:" onChange={this.updateLocation} />                        
                        <a href="" className="button-right" value="Next >>" name="2" onClick={this.handleFormSectionFilter} >   Next </a>                     
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
                        Step {this.state.formPartFilter} of 5
                        </p>
                        <h3>Perceived Gender</h3>
                        <RadioButtonListSection stateValue={this.state.perceivedGender} itemList={perceivedGender} function={this.perceivedGenderSelection} />
                        <h3>Perceived Race or Ethnicity</h3>
                        <CheckBoxListSection type="CheckBox" stateValue={this.state.perceivedRace}  itemList={perceivedRace} function={this.perceivedRaceSelection} />
                        <h3>Perceived Age</h3>
                        <RadioButtonListSection stateValue={this.state.perceivedAge} itemList={perceivedAge} function={this.perceivedAgeSelection} />
                        <h3>Perceived Or Know Disability</h3>
                        <CheckBoxListSection type="CheckBox" stateValue={this.state.perceivedOrKnownDisability} itemList={perceivedOrKnowDisability} function={this.perceivedOrKnowDisabilitySelection} />
                        <a href="" className="button-left" value="<< Back" name="1" onClick={this.handleFormSectionFilter} > Back </a>
                        <a href="" className="button-right" value="Next >>" name="3" onClick={this.handleFormSectionFilter} > Next </a>
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5
                        </p>
                    </div>
                }
                {this.state.formPartFilter === "3" &&
                    <div className="list-section">
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5
                        </p>
                        <h3>Type of Stop</h3>
                        <RadioButtonListSection stateValue={this.state.stopType} itemList={stopType} function={this.stopTypeSelection} />
                        
                        <h3>Reasons for Presence at Scene</h3>
                        
                        <CheckBoxListSection type="CheckBox" stateValue={this.state.reasonsForPresenceAtScene} itemList={reasonsForPresenceAtScene_1} function={this.reasonsForPresenceAtSceneSelection} />
                        {this.state.reasonsForPresenceAtScene.map(function (x) { return x.reason; }).indexOf("Radio Dispatch") > -1 &&
                            <CheckBoxListSection type="CheckBox" stateValue={this.state.reasonsForPresenceAtScene[this.state.reasonsForPresenceAtScene.map(function (x) { return x.reason; }).indexOf("Radio Dispatch")].details} itemList={radioDispatch} function={this.radioDispatchSelection} />
                        }
                        <CheckBoxListSection type="CheckBox" stateValue={this.state.reasonsForPresenceAtScene} itemList={reasonsForPresenceAtScene_2} function={this.reasonsForPresenceAtSceneSelection} />
                        {this.state.reasonsForPresenceAtScene.map(function (x) { return x.reason; }).indexOf("Planned Operation") > -1 &&
                        <CheckBoxListSection type="CheckBox" stateValue={this.state.reasonsForPresenceAtScene[this.state.reasonsForPresenceAtScene.map(function (x) { return x.reason; }).indexOf("Planned Operation")].details} itemList={plannedOperation} function={this.plannedOperationSelection} />
                        }
                        <CheckBoxListSection type="CheckBox" stateValue={this.state.reasonsForPresenceAtScene} itemList={reasonsForPresenceAtScene_3} function={this.reasonsForPresenceAtSceneSelection} />
                        <h3>Reasons For Stop</h3>
                        <CheckBoxListSection type="CheckBox" stateValue={this.state.reasonForStop} itemList={reasonsForStop_1} function={this.reasonsForStopSelection} />
                        {this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Traffic Violation") > -1 &&
                            <div>
                                <CheckBox2 key="Moving Violation" className="list-item-nested" checked={this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Traffic Violation")].details.map(function (y) {return y.reason}).indexOf("Moving Violation") > -1}  value="Moving Violation" name="Moving Violation" onClick={(e) => this.trafficViolationSelection(e)} />
                                {this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Traffic Violation")].details.map(function (x) { return x.reason; }).indexOf("Moving Violation") > -1 &&
                            <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                                }
                                <CheckBox2 key="Equipment Violation" className="list-item-nested" checked={this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Traffic Violation")].details.map(function (y) { return y.reason }).indexOf("Equipment Violation") > -1} value="Equipment Violation" name="Equipment Violation" onClick={(e) => this.trafficViolationSelection(e)} />
                                {this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Traffic Violation")].details.map(function (x) { return x.reason; }).indexOf("Equipment Violation") > -1 &&
                            <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                                }
                                <CheckBox2 key="Status Violation" className="list-item-nested" checked={this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Traffic Violation")].details.map(function (y) { return y.reason }).indexOf("Status Violation") > -1} value="Status Violation" name="Status Violation" onClick={(e) => this.trafficViolationSelection(e)} />
                                {this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Traffic Violation")].details.map(function (x) { return x.reason; }).indexOf("Status Violation") > -1 &&
                            <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                                }
                            </div>
                        }
                        <CheckBoxListSection type="CheckBox" stateValue={this.state.reasonForStop}  itemList={reasonsForStop_2} function={this.reasonsForStopSelection} progress={this.state.progress} />
                        {this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion") > -1 &&
                            <div>
                                <CheckBox2 key="Person Matched Description" className="list-item-nested" checked={this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (y) { return y.reason }).indexOf("Person Matched Description") > -1} value="Person Matched Description" name="Person Matched Description" onClick={(e) => this.reasonableSuspicionSelection(e)} />
                                {this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (x) { return x.reason; }).indexOf("Person Matched Description") > -1 &&
                            <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                                }
                                <CheckBox2 key="Witness or Victim ID of Suspect" className="list-item-nested" checked={this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (y) { return y.reason }).indexOf("Witness or Victim ID of Suspect") > -1} value="Witness or Victim ID of Suspect" name="Witness or Victim ID of Suspect" onClick={(e) => this.reasonableSuspicionSelection(e)} />
                                {this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (x) { return x.reason; }).indexOf("Witness or Victim ID of Suspect") > -1 &&
                            <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                                }
                                <CheckBox2 key="Carrying Suspicious Object" className="list-item-nested" checked={this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (y) { return y.reason }).indexOf("Carrying Suspicious Object") > -1} value="Carrying Suspicious Object" name="Carrying Suspicious Object" onClick={(e) => this.reasonableSuspicionSelection(e)} />
                                {this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (x) { return x.reason; }).indexOf("Carrying Suspicious Object") > -1 &&
                            <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                                }
                                <CheckBox2 key="Actions indicative of casing a victim or location" className="list-item-nested" checked={this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (y) { return y.reason }).indexOf("Actions indicative of casing a victim or location") > -1} value="Actions indicative of casing a victim or location" name="Actions indicative of casing a victim or location" onClick={(e) => this.reasonableSuspicionSelection(e)} />
                                {this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (x) { return x.reason; }).indexOf("Actions indicative of casing a victim or location") > -1 &&
                            <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                                }
                                <CheckBox2 key="Suspected of Acting as Lookout" className="list-item-nested" checked={this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (y) { return y.reason }).indexOf("Suspected of Acting as Lookout") > -1} value="Suspected of Acting as Lookout" name="Suspected of Acting as Lookout" onClick={(e) => this.reasonableSuspicionSelection(e)} />
                                {this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (x) { return x.reason; }).indexOf("Suspected of Acting as Lookout") > -1 &&
                            <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                                }
                                <CheckBox2 key="Actions indicative of drug transaction" className="list-item-nested" checked={this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (y) { return y.reason }).indexOf("Actions indicative of drug transaction") > -1} value="Actions indicative of drug transaction" name="Actions indicative of drug transaction" onClick={(e) => this.reasonableSuspicionSelection(e)} />
                                {this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (x) { return x.reason; }).indexOf("Actions indicative of drug transaction") > -1 &&
                            <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                                }
                                <CheckBox2 key="Actions indicative of engaging in violent crime" className="list-item-nested" checked={this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (y) { return y.reason }).indexOf("Actions indicative of engaging in violent crime") > -1} value="Actions indicative of engaging in violent crime" name="Actions indicative of engaging in violent crime" onClick={(e) => this.reasonableSuspicionSelection(e)} />
                                {this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (x) { return x.reason; }).indexOf("Actions indicative of engaging in violent crime") > -1 &&
                            <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                                }
                                <CheckBox2 key="Carrying objects in plain view used in commission of crime" className="list-item-nested" checked={this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (y) { return y.reason }).indexOf("Carrying objects in plain view used in commission of crime") > -1} value="Carrying objects in plain view used in commission of crime" name="Carrying objects in plain view used in commission of crime" onClick={(e) => this.reasonableSuspicionSelection(e)} />
                                {this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (x) { return x.reason; }).indexOf("Carrying objects in plain view used in commission of crime") > -1 &&
                            <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                                }
                                <CheckBox2 key="Other Reasonable Suspicion" className="list-item-nested" checked={this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (y) { return y.reason }).indexOf("Other Reasonable Suspicion") > -1} value="Other Reasonable Suspicion" name="Other Reasonable Suspicion" onClick={(e) => this.reasonableSuspicionSelection(e)} />
                                {this.state.reasonForStop[this.state.reasonForStop.map(function (x) { return x.reason; }).indexOf("Reasonable Suspicion")].details.map(function (x) { return x.reason; }).indexOf("Other Reasonable Suspicion") > -1 &&
                            <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                                }
                            </div>
                        }
                        <CheckBoxListSection type="CheckBox" stateValue={this.state.reasonForStop}  itemList={reasonsForStop_3} function={this.reasonsForStopSelection} />
                        <a href="" className="button-left" value="<< Back" name="2" onClick={this.handleFormSectionFilter} > Back </a>
                        <a href="" className="button-right" value="Next >>" name="4" onClick={this.handleFormSectionFilter} > Next </a>
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5
                        </p>
                    </div>
                }
                {this.state.formPartFilter === "4" &&
                    <div className="list-section">
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5
                        </p>
                        <h3>Actions Taken During Stop</h3>
                        <CheckBoxListSection type="CheckBox" stateValue={this.state.actionsTakenDuringStop} itemList={actionsTakenDuringStop_1} function={this.actionsTakenDuringStopSelection} />
                        {this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Weapon removed from holster or brandished") > -1 &&
                             <CheckBoxListSection type="CheckBox" stateValue={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Weapon removed from holster or brandished")].details} itemList={weaponBrandishedOrDischarged} function={this.weaponBrandishedSelection} />
                        }
                        <CheckBox2 key="Weapon was discharged or used" className="list-item" checked={this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Weapon was discharged or used") > -1} value="Weapon was discharged or used" name="Other Reasonable Suspicion" onClick={(e) => this.actionsTakenDuringStopSelection(e)} />
                        {this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Weapon was discharged or used") > -1 &&
                            <CheckBoxListSection type="CheckBox" stateValue={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Weapon was discharged or used")].details} itemList={weaponBrandishedOrDischarged} function={this.weaponDischarchedSelection} />
                        }
                        <CheckBox2 key="Other use of force" className="list-item" checked={this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Other use of force") > -1} value="Other use of force" name="Other use of force" onClick={(e) => this.actionsTakenDuringStopSelection(e)} />
                        <CheckBox2 key="Asked for consent to search person" className="list-item" checked={this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search person") > -1} value="Asked for consent to search person" name="Asked for consent to search person" onClick={(e) => this.actionsTakenDuringStopSelection(e)} />
                        {this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search person") > -1 &&
                        <CheckBox2 key="personSearchConsentGiven" checked={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search person") ].personSearchConsentGiven} className="list-item-nested" value="Person Search Consent Given" name="personSearchConsentGiven" onClick={(e) => this.searchConsentGiven(e)} />
                        }
                        <CheckBox2 key="Search of person was conducted" className="list-item" checked={this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted") > -1} value="Search of person was conducted" name="Search of person was conducted" onClick={(e) => this.actionsTakenDuringStopSelection(e)} />
                        {this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted") > -1 &&
                            <div>
                                <h4 className="info list-item-nested">Basis for search:</h4>
                                <CheckBoxListSection type="CheckBox" stateValue={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted")].basisForSearch} itemList={seachOfPersonOrPropertyConducted} function={this.basisForPersonSearchSelection} />
                                <CheckBox2 key="Incident to pat-down search" checked={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted")].basisForSearch.map(function (y) { return y.basis }).indexOf("Incident to pat-down search") > -1} className="list-item-nested" value="Incident to pat-down search" name="Incident to pat-down search" onClick={(e) => this.basisForPersonSearchSelection(e)} />
                                <CheckBox2 key="Exigent circumstances/emergency" checked={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted")].basisForSearch.map(function (y) { return y.basis }).indexOf("Exigent circumstances/emergency") > -1}  className="list-item-nested" value="Exigent circumstances/emergency" name="Exigent circumstances/emergency" onClick={(e) => this.basisForPersonSearchSelection(e)} />
                                <h4 className="info list-item-nested">Contraband or evidence discovered:</h4>
                                <CheckBoxListSection type="CheckBox" stateValue={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted")].contrabandOrEvidenceDiscovered} itemList={contrabandOrEvidence_1} function={this.contrabandOrEvidenceDiscoveredSelection} />
                                {this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted")].contrabandOrEvidenceDiscovered.map(function (x) { return x.contraband; }).indexOf("Money") > -1 &&
                                    <TextInput type="number" stateValue={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted")].contrabandOrEvidenceDiscovered[this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted")].contrabandOrEvidenceDiscovered.map(function (x) { return x.contraband; }).indexOf("Money")].amount} name="ContrabandAmount" className="list-item-nested" label="Amount:" onChange={this.updateAmount} />
                                }
                                <CheckBoxListSection type="CheckBox" stateValue={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of person was conducted")].contrabandOrEvidenceDiscovered} itemList={contrabandOrEvidence_2} function={this.contrabandOrEvidenceDiscoveredSelection} />
                            </div>
                        }
                        <CheckBox2 key="Asked for consent to search property" className="list-item" checked={this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search property") > -1} value="Asked for consent to search property" name="Asked for consent to search property" onClick={(e) => this.actionsTakenDuringStopSelection(e)} />
                        {this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search property") > -1 &&
                        <CheckBox2 key="propertySearchConsentGiven" checked={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Asked for consent to search property")].propertySearchConsentGiven} className="list-item-nested" value="Property Search Consent Given" name="propertySearchConsentGiven" onClick={(e) => this.searchConsentGiven(e)} />
                        }
                        <CheckBox2 key="Search of property was conducted" className="list-item" checked={this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of property was conducted") > -1} value="Search of property was conducted" name="Search of property was conducted" onClick={(e) => this.actionsTakenDuringStopSelection(e)} />
                        {this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of property was conducted") > -1 &&
                            <div>
                                <h4 className="info list-item-nested">Basis for search:</h4>
                                <CheckBoxListSection type="CheckBox" stateValue={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of property was conducted")].basisForSearch} itemList={seachOfPersonOrPropertyConducted} function={this.basisForPropertySearchSelection} />
                                <CheckBox2 key="Exigent circumstances/emergency" checked={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of property was conducted")].basisForSearch.map(function (y) { return y.basis }).indexOf("Exigent circumstances/emergency") > -1} className="list-item-nested" value="Exigent circumstances/emergency" name="Exigent circumstances/emergency" onClick={(e) => this.basisForPropertySearchSelection(e)} />
                                <CheckBox2 key="Vehicle inventory" checked={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of property was conducted")].basisForSearch.map(function (y) { return y.basis }).indexOf("Vehicle inventory") > -1} className="list-item-nested" value="Vehicle inventory" name="Vehicle inventory" onClick={(e) => this.basisForPropertySearchSelection(e)} />
                                <CheckBox2 key="Abandoned Property" checked={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Search of property was conducted")].basisForSearch.map(function (y) { return y.basis }).indexOf("Abandoned Property") > -1} className="list-item-nested" value="Abandoned Property" name="Abandoned Property" onClick={(e) => this.basisForPropertySearchSelection(e)} />
                            </div>
                        }
                        <CheckBox2 key="Property was seized" className="list-item" checked={this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Property was seized") > -1} value="Property was seized" name="Property was seized" onClick={(e) => this.actionsTakenDuringStopSelection(e)} />
                        {this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Property was seized") > -1 &&
                            <div>
                                <h4 className="info list-item-nested">Basis for property seizure:</h4>
                                <CheckBoxListSection type="CheckBox" stateValue={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Property was seized")].basisForPropertySeizure} itemList={basisForPropertySeizure} function={this.basisForPropertySeizureSelection} />
                                <h4 className="info list-item-nested">Type of property seized:</h4>
                                <CheckBoxListSection type="CheckBox" stateValue={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Property was seized")].typeOfPropertySeized} itemList={contrabandOrEvidence_1} function={this.typeOfPropertySeizedSelection} />

                                {this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Property was seized")].typeOfPropertySeized.map(function (x) { return x.type; }).indexOf("Money") > -1 &&
                                    <TextInput type="number" stateValue={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Property was seized")].typeOfPropertySeized[this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Property was seized")].typeOfPropertySeized.map(function (x) { return x.type; }).indexOf("Money")].amount} name="SeizedAmount" className="list-item-nested" label="Amount:" onChange={this.updateAmount} />
                                }
                                <CheckBoxListSection type="CheckBox" stateValue={this.state.actionsTakenDuringStop[this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("Property was seized")].typeOfPropertySeized} itemList={contrabandOrEvidence_2} function={this.typeOfPropertySeizedSelection} />
                            </div>
                        }
                        <CheckBox2 key="None of the above" className="list-item" checked={this.state.actionsTakenDuringStop.map(function (x) { return x.action; }).indexOf("None of the above") > -1} value="None of the above" name="None of the above" onClick={(e) => this.actionsTakenDuringStopSelection(e)} />
                        <h3>Result of stop</h3>
                        <CheckBox2 key="No Action" className="list-item" checked={this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("No Action") > -1} value="No Action" name="No Action" onClick={(e) => this.resultOfStopSelection(e)} />
                        <CheckBox2 key="Warning" className="list-item" checked={this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Warning") > -1} value="Warning" name="Warning" onClick={(e) => this.resultOfStopSelection(e)} />
                        {this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Warning") > -1 &&
                            <div>
                                <CheckBox2 key="Verbal Warning" checked={this.state.resultOfStop[this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Warning")].isVerbalWarning} className="list-item-nested" value="Verbal Warning" name="Verbal Warning" onClick={(e) => this.warningTypeSelection(e)} />
                                <CheckBox2 key="Written Warning" checked={this.state.resultOfStop[this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Warning")].isWrittenWarning} className="list-item-nested" value="Written Warning" name="Written Warning" onClick={(e) => this.warningTypeSelection(e)} />
                                <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                            </div>
                        }
                        <CheckBox2 key="Citation or infraction" className="list-item" checked={this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Citation or infraction") > -1} value="Citation or infraction" name="Citation or infraction" onClick={(e) => this.resultOfStopSelection(e)} />
                        {this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Citation or infraction") > -1 &&
                        <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                        }
                        <CheckBox2 key="Cite and Release" className="list-item" checked={this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Cite and Release") > -1} value="Cite and Release" name="Cite and Release" onClick={(e) => this.resultOfStopSelection(e)} />
                        {this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Cite and Release") > -1 &&
                        <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                        }
                        <CheckBox2 key="Custodial Arrest" className="list-item" checked={this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Custodial Arrest") > -1} value="Custodial Arrest" name="Custodial Arrest" onClick={(e) => this.resultOfStopSelection(e)} />
                        {this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Custodial Arrest") > -1 &&
                        <Codes name="codes" className="list-item-nested" codes={this.state.codes.json} />
                        }
                        <CheckBox2 key="Person taken into custody, referred to another agency, or transported" className="list-item" checked={this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Person taken into custody, referred to another agency, or transported") > -1} value="Person taken into custody, referred to another agency, or transported" name="Person taken into custody, referred to another agency, or transported" onClick={(e) => this.resultOfStopSelection(e)} />
                        {this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Person taken into custody, referred to another agency, or transported") > -1 &&
                            <CheckBoxListSection type="CheckBox" stateValue={this.state.resultOfStop[this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Person taken into custody, referred to another agency, or transported")].details} itemList={custodyDetails} function={this.custodyDetailsSelection} />
                        }
                        <CheckBox2 key="Person stopped died during encounter with officer" className="list-item" checked={this.state.resultOfStop.map(function (x) { return x.result; }).indexOf("Person stopped died during encounter with officer") > -1} value="Person stopped died during encounter with officer" name="Person stopped died during encounter with officer" onClick={(e) => this.resultOfStopSelection(e)} />
                        <a href="" className="button-left" value="<< Back" name="3" onClick={this.handleFormSectionFilter} > Back </a>
                        <a href="" className="button-right" value="Next >>" name="5" onClick={this.handleFormSectionFilter} > Next </a>
                        <p className="styled">
                            <progress value={this.state.progress} max="100"></progress>
                            Step {this.state.formPartFilter} of 5
                        </p>
                    </div>
                }
                {this.state.formPartFilter === "5" &&
                    <div className="list-section">
                        <p className="styled">
                        <progress value={this.state.progress} max="100"></progress>
                        Step {this.state.formPartFilter} of 5
                        </p>
                        <h3>Officer Years Of Experience</h3>
                        <RadioButtonListSection stateValue={this.state.officerYearsExperience} itemList={officerYearsExperience} function={this.officerYearsExperienceSelection} />
                        <h3>Officer Assignment</h3>
                        <RadioButtonListSection stateValue={this.state.officerAssignment.type} itemList={officerAssignment} function={this.officerAssignmentSelection} />
                        {this.state.officerAssignment.type == "Other" &&
                        <TextInput type="text" stateValue={this.state.officerAssignment.otherType} name="otherType" className="list-item-nested" label="Other Type:" onChange={this.officerAssignmentSelection} />
                        }
                        <a href="" className="button-left" value="<< Back" name="4" onClick={this.handleFormSectionFilter} > Back </a>
                        <a href="" className="button-right" value="Next >>" value="Submit" name="Submit" onClick={this.handleSubmit} > Submit </a>
                        
                        <p className="styled">
                        <progress value={this.state.progress} max="100">{this.state.progress}</progress>
                        Step {this.state.formPartFilter} of 5
                        </p>
                    </div>
                }
                
                    
               
                <pre>{JSON.stringify(this.state, null, 2)}</pre>
                
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
                                key={item.value}
                                className={item.className}
                                value={item.value}
                                onClick={(e) => this.props.function(e)}
                                checked={this.props.stateValue != null &&
                                    this.props.stateValue.map(function (x) {
                                        for (key in x) {
                                            if (x.hasOwnProperty(key)) {
                                                return x[key]
                                            }
                                        }
                                    }).indexOf(item.value) > -1 ?  true  : null
                                }
                            />
                    )}
                </div>
            </div>
        );
    }
}

//<CheckBox2 key="Patrol" className="list-item" checked={this.state.reasonsForPresenceAtScene.map(function (x) { return x.reason; }).indexOf("Patrol") > -1} value="Patrol" name="Patrol" onClick={(e) => this.reasonsForPresenceAtSceneSelection(e)} />
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
                                key={item.value}
                                className={item.className}
                                value={item.value}
                                onClick={(e) => this.props.function(e)}
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
                <input value={this.props.stateValue} type={this.props.type} name={this.props.name} className={this.props.className} onChange={this.props.onChange}  />
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
                {this.props.codes.map((item) => <option key={item} value={item}>{item}</option> )}
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
        )
    }
}

const stopDuration = [
    { value: "0-10", className: "list-item", onClick: "" },
    { value: "11-20", className: "list-item", onClick: "" },
    { value: "21-30", className: "list-item", onClick: "" },
    { value: "31-60", className: "list-item", onClick: "" },
    { value: ">60", className: "list-item", onClick: "" }
];
const stopType = [
    { value: "Vehicle - Driver", className: "list-item", onClick: "" },
    { value: "Vehicle - Passenger", className: "list-item", onClick: "" },
    { value: "Non Vehicle", className: "list-item", onClick: "" },
    { value: "Bicycle", className: "list-item", onClick: "" }
];
const perceivedRace = [
    { value: "Asian or pacific Islander", className: "list-item", onClick: "" },
    { value: "Black or African American", className: "list-item", onClick: ""},
    { value: "Hispanic or Latino/a", className: "list-item", onClick: ""},
    { value: "Middle Eastern or South Asian", className: "list-item", onClick: "" },
    { value: "Native American", className: "list-item", onClick: "" },
    { value: "White", className: "list-item", onClick: "" }
];
const perceivedGender = [
    { value: "Male", className: "list-item", onClick: "" },
    { value: "Female", className: "list-item", onClick: "" },
    { value: "Transgender man", className: "list-item", onClick: "" },
    { value: "Transgender woman", className: "list-item", onClick: "" },
    { value: "Gender nonconforming", className: "list-item", onClick: "" }
];
const perceivedAge = [
    { value: "0-9", className: "list-item", onClick: "" },
    { value: "10-14", className: "list-item", onClick: "" },
    { value: "15-17", className: "list-item", onClick: "" },
    { value: "18-24", className: "list-item", onClick: "" },
    { value: "25-29", className: "list-item", onClick: "" },
    { value: "30-39", className: "list-item", onClick: "" },
    { value: "40-49", className: "list-item", onClick: "" },
    { value: "50-59", className: "list-item", onClick: "" },
    { value: "=>60", className: "list-item", onClick: "" }
];

const perceivedOrKnowDisability = [
    { value: "Deafness or difficulty hearing", className: "list-item", onClick: "" },
    { value: "Other physical disability", className: "list-item", onClick: "" },
    { value: "Impaired mental health or psychiatric condition", className: "list-item", onClick: "" },
    { value: "Development disability", className: "list-item", onClick: "" },
    { value: "None", className: "list-item", onClick: "" }
];
const reasonsForPresenceAtScene_1 = [
    { value: "Patrol", className: "list-item", onClick: "" },
    { value: "Radio Dispatch", className: "list-item", onClick: "" }
];
const radioDispatch = [
    { value: "Suspicious/Criminal Activity", className: "list-item-nested", onClick: "" },
    { value: "Description of Suspect", className: "list-item-nested", onClick: "" },
    { value: "Citizen Call", className: "list-item-nested", onClick: "" },
    { value: "Other", className: "list-item-nested", onClick: "" }
];
const reasonsForPresenceAtScene_2 = [
    { value: "Witness Interview", className: "list-item", onClick: "" },
    { value: "Citizen Initiated", className: "list-item", onClick: "" },
    { value: "Planned Operation", className: "list-item", onClick: "" }
];
const plannedOperation = [
    { value: "Search Warrant Execution", className: "list-item-nested", onClick: "" },
    { value: "Arrest Warrant Execution", className: "list-item-nested", onClick: "" },
    { value: "DUI Sobriety Checkpoint or Other Roadblock", className: "list-item-nested", onClick: "" },
    { value: "Traffic Control", className: "list-item-nested", onClick: "" },
    { value: "Crowd Control", className: "list-item-nested", onClick: "" },
    { value: "Building or Event Security", className: "list-item-nested", onClick: "" },
    { value: "Other", className: "list-item-nested", onClick: "" }
];
const reasonsForPresenceAtScene_3 = [
    { value: "Other Community Caretaking", className: "list-item", onClick: "" },
    { value: "K-12 School Assignment", className: "list-item", onClick: "" },
    { value: "Civil Disorder", className: "list-item", onClick: "" },
    { value: "Other", className: "list-item", onClick: "" }
];
const reasonsForStop_1 = [
    { value: "Traffic Violation", className: "list-item", onClick: "" }
];
const reasonsForStop_2 = [
    { value: "Reasonable Suspicion", className: "list-item", onClick: "" }
];
const reasonsForStop_3 = [
    { value: "Probable Cause to arrest", className: "list-item", onClick: "" },
    { value: "Probable Cause to search", className: "list-item", onClick: "" },
    { value: "Parole/Probation/PRCS/Manatory Supervision", className: "list-item", onClick: "" },
    { value: "Consensual Encounter", className: "list-item", onClick: "" }
];
const actionsTakenDuringStop_1 = [
    { value: "Person removed from vehicle by order or physical contact", className: "list-item", onClick: "" },
    { value: "Field sobriety check conducted", className: "list-item", onClick: "" },
    { value: "Curbside detention", className: "list-item", onClick: "" },
    { value: "Handcuffed", className: "list-item", onClick: "" },
    { value: "Patrol car detention", className: "list-item", onClick: "" },
    { value: "Use of canine in apprehension", className: "list-item", onClick: "" },
    { value: "Weapon removed from holster or brandished", className: "list-item", onClick: "" }
];
const weaponBrandishedOrDischarged = [
    { value: "Firearm", className: "list-item-nested", onClick: "" },
    { value: "Taser or electronic control device", className: "list-item-nested", onClick: "" },
    { value: "Stun gun, BB gun, pellet gun, air gun, ga-powered gun, rubber bullets or bean bag", className: "list-item-nested", onClick: "" },
    { value: "Baton", className: "list-item-nested", onClick: "" },
    { value: "Pepper spray or mace", className: "list-item-nested", onClick: "" }
];
const seachOfPersonOrPropertyConducted = [
    { value: "Officer Safety", className: "list-item-nested", onClick: "" },
    { value: "Search Warrant", className: "list-item-nested", onClick: "" },
    { value: "Condition of parole/probation/PRCS/mandatory supervision", className: "list-item-nested", onClick: "" },
    { value: "Suspected weapons", className: "list-item-nested", onClick: "" },
    { value: "Visible contraband", className: "list-item-nested", onClick: "" },
    { value: "Odor of contraband", className: "list-item-nested", onClick: "" },
    { value: "Canine detection", className: "list-item-nested", onClick: "" },
    { value: "Evidence of crime", className: "list-item-nested", onClick: "" },
    { value: "Incident to arrest", className: "list-item-nested", onClick: "" }
];
const contrabandOrEvidence_1 = [
    { value: "Firearm(s)", className: "list-item-nested", onClick: "" },
    { value: "Ammunition", className: "list-item-nested", onClick: "" },
    { value: "Weapon(s) other than a firearm", className: "list-item-nested", onClick: "" },
    { value: "Drugs/narcotics", className: "list-item-nested", onClick: "" },
    { value: "Alcohol", className: "list-item-nested", onClick: "" },
    { value: "Money", className: "list-item-nested", onClick: "" }
];
const contrabandOrEvidence_2 = [
    { value: "Drug Paraphernalia", className: "list-item-nested", onClick: "" },
    { value: "Suspected Stolen property", className: "list-item-nested", onClick: "" },
    { value: "Cell phone(s) or electronic device(s)", className: "list-item-nested", onClick: "" },
    { value: "Vehicle", className: "list-item-nested", onClick: "" },
    { value: "Other Contraband", className: "list-item-nested", onClick: "" },
    { value: "Other Evidence", className: "list-item-nested", onClick: "" }
];
const basisForPropertySeizure = [
    { value: "Safekeeping as allowed by law/statute", className: "list-item-nested", onClick: "" },
    { value: "Forfeiture", className: "list-item-nested", onClick: "" },
    { value: "Contraband", className: "list-item-nested", onClick: "" },
    { value: "Evidence", className: "list-item-nested", onClick: "" },
    { value: "Impound of vehicle", className: "list-item-nested", onClick: "" },
    { value: "Abandoned property", className: "list-item-nested", onClick: "" }
];
const resultOfStop = [
    { value: "No Action", className: "list-item", onClick: "" },
    { value: "Warning", className: "list-item", onClick: "" },
    { value: "Citation or infraction", className: "list-item", onClick: "" },
    { value: "Cite and Release", className: "list-item", onClick: "" },
    { value: "Custodial Arrest", className: "list-item", onClick: "" },
    { value: "Person taken into custody, referred to another agency, or transported", className: "list-item", onClick: "" },
    { value: "Person stopped died during encounter with officer", className: "list-item", onClick: "" },
]
const custodyDetails = [
    { value: "Psychiatric hold", className: "list-item-nested", onClick: "" },
    { value: "Civil protective custody", className: "list-item-nested", onClick: "" },
    { value: "Transported for medical treatment", className: "list-item-nested", onClick: "" },
    { value: "Transported to custody of school official", className: "list-item-nested", onClick: "" },
    { value: "Transported to custody of family member", className: "list-item-nested", onClick: "" },
    { value: "Community caretaking transport", className: "list-item-nested", onClick: "" },
    { value: "Referred to U.S. Citizenship and Immigration Services", className: "list-item-nested", onClick: "" },
    { value: "Other", className: "list-item-nested", onClick: "" }
];
const officerYearsExperience = [
    { value: "0-3", className: "list-item", onClick: "" },
    { value: "4-10", className: "list-item", onClick: "" },
    { value: ">10", className: "list-item", onClick: "" }
];
const officerAssignment = [
    { value: "Patrol", className: "list-item", onClick: "" },
    { value: "Traffic", className: "list-item", onClick: "" },
    { value: "Gang", className: "list-item", onClick: "" },
    { value: "Special assignment", className: "list-item", onClick: "" },
    { value: "Narcotics", className: "list-item", onClick: "" },
    { value: "Vice", className: "list-item", onClick: "" },
    { value: "Violence suppression/crime suppression", className: "list-item", onClick: "" },
    { value: "K1-12 public school setting", className: "list-item", onClick: "" },
    { value: "Other", className: "list-item", onClick: "" }
];

ReactDOM.render(
    <Form/>,
    document.getElementById('root')
);