
class StopView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stops: [],
            isLoading: true
        };
    }
    componentWillMount() {
        var that = this;        
        var newState = fetch('/api/StopsAPI/', {
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
        var stops = this.state.stops.slice();
        this.setState({ stops: newState, isLoading: false });
        console.log(this.state)
    }

    render() {
        return (
            <div>
             { !this.state.isLoading &&
                <Stops stopList={this.state.stops} />
             }
            </div> 
        );
    }
}

ReactDOM.render(
    <StopView />,
    document.getElementById('stop')
);