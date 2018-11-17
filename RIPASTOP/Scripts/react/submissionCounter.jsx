class CounterVW extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Total: '',
            Success: '',
            Fatal: '',
            Error: '',
            ServiceError: '',
            isLoading: true
        };
    }
    componentWillMount() {
        var that = this;
        const submissionID = document.getElementById('submissionID').innerHTML;
        var fetchURL = '/api/DOJSubmit/' + submissionID;

        var newState = fetch(fetchURL, {
            method: 'get',
            credentials: "same-origin"
        }).then(function (response) {
            console.log(response)
            return response.json()
                .then(function (aggregate) {
                    console.log(aggregate)
                    that.updateState(aggregate)
                })
                .catch(error => console.log('Failed to get aggregate: ', error));
        })
    }

    componentDidMount() {
        var thiss = this;
        var that = this.state;
        const submissionID = document.getElementById('submissionID').innerHTML;
        var fetchURL = '/api/DOJSubmit/' + submissionID;

        var interval = setInterval(() => fetch(fetchURL, {
            method: 'get',
            credentials: "same-origin"
        }).then(function (response) {
            console.log(response)
            return response.json()
                .then(function (aggregate) {
                    console.log(aggregate)
                    if (aggregate.submissionID != 0 && typeof aggregate.submissionID !== 'undefined') {
                        fetchURL = '/api/DOJSubmit/' + aggregate.submissionID;
                        //interval = null;
                        //interval = setInterval(fetch, 40000);
                        //request.onreadystatechange = null;
                        //request.abort = null;
                        //request = null;
                    }
                    if (that.Total !== aggregate.processedCount) {
                        thiss.updateState(aggregate);

                    }
                    else {
                        if (aggregate.submissionID != 0 &&
                            typeof aggregate.submissionID !== 'undefined' && 
                            aggregate.processedCount != 0) {
                            clearInterval(interval);
                        }
                    }
                })
                .catch(error => console.log('Failed to get aggregate:', error));
        }), 40000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    updateState(newState) {
        this.setState({
            Total: newState.processedCount,
            Success: newState.succeededCount,
            Fatal: newState.fatalCount,
            Error: newState.failedCount,
            ServiceError: newState.httpErrCount,
            isLoading: false 
        });
        console.log(this.state)
    }

    render() {
        return (
            <div>

                {!this.state.isLoading &&
                    <div>
                        <label>Total </label>
                        <span className="statuspill blue">{this.state.Total}</span>
                        <label>Success </label>
                        <span className="statuspill green">{this.state.Success}</span>
                        <label>Fatal </label>
                        <span className="statuspill">{this.state.Fatal}</span>
                        <label>Error </label>
                        <span className="statuspill">{this.state.Error}</span>
                        <label>Service Error </label>
                        <span className="statuspill">{this.state.ServiceError}</span>
                    </div>
                }
            </div>
        );
    }
}

ReactDOM.render(
    <CounterVW />,
    document.getElementById('count')
);