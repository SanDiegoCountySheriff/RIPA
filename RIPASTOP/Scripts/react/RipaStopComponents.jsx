function Stops(props) {
    //const jsonx = props.stopList.map(x => JSON.parse(x.JsonStop));
    const stopList = props.stopList.map((s) =>

        <div className="stops-detail">
            <label>Person Count <pre>{s.PersonCount}</pre></label>
            <ul>
                <ListValue className="" labelValue="Stop ID" stateValue={s.ID} />
                <ListValue className="" labelValue="Date" stateValue={JSON.parse(s.JsonStop).date} />
                <ListValue className="" labelValue="Time" stateValue={JSON.parse(s.JsonStop).time} />
                <li>
                    Location
                    <ul>
                        {JSON.parse(s.JsonStop).location.school &&
                            <ListValue className="" labelValue="School Name" stateValue={JSON.parse(s.JsonStop).location.schoolName.codes[0].text} />
                        }
                        {JSON.parse(s.JsonStop).location.intersection &&
                            <ListValue className="" labelValue="Intersection" stateValue={JSON.parse(s.JsonStop).location.intersection} />
                        }
                        {JSON.parse(s.JsonStop).location.blockNumber &&
                            <ListValue className="" labelValue="Block" stateValue={JSON.parse(s.JsonStop).location.blockNumber} />
                        }
                        {JSON.parse(s.JsonStop).location.streetName &&
                            <ListValue className="" labelValue="Street" stateValue={JSON.parse(s.JsonStop).location.streetName} />
                        }
                        {JSON.parse(s.JsonStop).location.city &&
                            <ListValue className="" labelValue="City" stateValue={JSON.parse(s.JsonStop).location.city.codes[0].text} />
                        }
                        {JSON.parse(s.JsonStop).location.landMark &&
                            <ListValue className="" labelValue="Landmark" stateValue={JSON.parse(s.JsonStop).location.landMark} />
                        }
                        {JSON.parse(s.JsonStop).location.highwayExit &&
                            <ListValue className="" labelValue="Highway Exit" stateValue={JSON.parse(s.JsonStop).location.highwayExit} />
                        }
                    </ul>
                </li>

                <ListValue className="" labelValue="Duration (m)" stateValue={JSON.parse(s.JsonStop).stopDuration} />

                {JSON.parse(s.JsonStop).stopInResponseToCFS &&
                    <ListBoolean className="" labelValue="Stop In Response To CFS" stateValue={JSON.parse(s.JsonStop).stopInResponseToCFS} />
                }
            </ul>
            <ListPerson persons={JSON.parse(s.JsonStop).ListPerson_Stopped} />

            {s.Longitude && s.Latitude &&
                <div>
                    <label>Lat & Long: <pre>{s.Longitude}/{s.Latitude}</pre></label>
                </div>
            }
            {s.Beat &&
                <div>
                    <label>Beat: <pre>{s.Beat}</pre></label>
                </div>
            }
            {s.Status &&
                <div>
                    <label>Status: <pre>{s.Status}</pre></label>
                </div>
            }
        </div>
    );
    return (
        <span>{stopList}</span>
    );
}

function ListPerson(props) {
    const personsL = props.persons;
    const pList = personsL.map((p) =>
            <ul>
                <li>Person {personsL.indexOf(p) + 1}</li>
                {/*<ListValue className="" labelValue="PID" stateValue={p.PID} />*/}
                {p.Is_Stud &&
                    <ListValue className="" labelValue="Is Student" stateValue={JSON.stringify(p.Is_Stud, null, 2)} />
                }
                <li>
                    Perceived Race
                    <ListArray list={p.perceivedRace} param1="race" />
                </li>
                <ListValue className="" labelValue="Perceived Age" stateValue={p.perceivedAge} />
                <ListValue className="" labelValue="Perceived Gender" stateValue={p.perceivedGender} />
                <ListValue className="" labelValue="Gender Nonconforming" stateValue={JSON.stringify(p.genderNonconforming, null, 2)} />
                <ListValue className="" labelValue="Perceived LGBT" stateValue={p.perceivedLgbt} />
                {p.perceivedLimitedEnglish &&
                    <ListValue className="" labelValue="Limited English" stateValue={JSON.stringify(p.perceivedLimitedEnglish, null, 2)} />
                }
                <li>
                    Perceived Disability
                    <ListArray list={p.perceivedOrKnownDisability} param1="disability" />
                </li>
                {p.reasonForStop.reason &&
                    <li>
                        Reason For Stop
                        <ul>
                            <ListValue className="" labelValue="" stateValue={p.reasonForStop.reason} />
                            {p.reasonForStop.details[0].reason &&
                                <ListArray list={p.reasonForStop.details} param1="reason" />
                            }
                            {p.reasonForStop.codes &&
                                <ul>
                                    <li>
                                        <ListArray list={p.reasonForStop.codes} param1="text" />
                                    </li>
                                </ul>
                            }
                            <ListValue className="" labelValue="Reason For Stop Explanation" stateValue={p.reasonForStopExplanation} />
                        </ul>
                    </li>
                }
                {p.actionsTakenDuringStop &&
                    <li>
                        Actions Taken During Stop
                        <ListArray list={p.actionsTakenDuringStop} param1="action" />
                        <ul>
                            {p.basisForSearch.length > 0 &&
                                <li>
                                    Basis For Search
                                    <ListArray list={p.basisForSearch} param1="basis" />
                                    {p.basisForSearchBrief &&
                                        <ListValue className="" labelValue="Basis For Search Explanation" stateValue={p.basisForSearchBrief} />
                                    }
                                </li>
                            }
                            {p.basisForPropertySeizure.length > 0 &&
                                <li>
                                    Basis For Property Seizure
                                    <ListArray list={p.basisForPropertySeizure} param1="basis" />
                                </li>
                            }
                            {p.typeOfPropertySeized.length > 0 &&
                                <li>
                                    Type of Property Seized
                                    <ListArray list={p.typeOfPropertySeized} param1="type" />
                                </li>
                            }
                        </ul>
                    </li>
                }
                <li>
                    Contraband Or Evidence Discovered
                    <ListArray list={p.contrabandOrEvidenceDiscovered} param1="contraband" />
                </li>
                <li>
                    Result of Stop
                    <ListArray list={p.resultOfStop} param1="result" list2="codes" param2="text" />
                </li>
            </ul>
    );
    return (
        <div>{pList}</div>
    );
}

function ListArray(props) {
    const myList = props.list.map(function (r) {
        if (r[props.list2] !== undefined && r[props.list2].length !== 0) {
            return (
                <li>
                    <pre>{r[props.param1]}</pre>
                    <ListArray list={r[props.list2]} param1={props.param2} />
                </li>
            )
        }
        else {
            if (r.personSearchConsentGiven) {
                return (
                    <li>
                        <pre>{r.action}</pre>
                        <pre>{JSON.stringify(r.personSearchConsentGiven)}</pre>
                    </li>
                )
            }
            if (r.propertySearchConsentGiven) {
                return (
                    <li>
                        <pre>{r.action}</pre>
                        <pre>{JSON.stringify(r.propertySearchConsentGiven)}</pre>
                    </li>
                )
            }
        }


        return (
            <li>
                <pre>{r[props.param1]}</pre>
            </li>
        );

    });
    return (
        <ul>{myList}</ul>
    );
}

class ListValue extends React.Component {
    render(props) {
        //if ((typeof this.props.stateValue) !== "undefined") {
        if ((typeof this.props.stateValue) === "string" || (typeof this.props.stateValue) === "number") {
            return (
                <li>
                    <span>{this.props.labelValue}</span>
                    <pre>{this.props.stateValue}</pre>
                </li>
            );
        }
        else {
            return (
                <li>
                    <span>{this.props.labelValue}</span>
                    <ListArray list={this.props.stateValue} param1="text" />
                </li>
            );
        }
    }
}

class ListBoolean extends React.Component {
    render(props) {
        return (
            <li>
                <span>{this.props.labelValue}</span>
                <pre>{JSON.stringify(this.props.stateValue, null, 2)}</pre>
            </li>
        );
    }
}