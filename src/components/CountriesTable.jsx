import _ from 'lodash';
import React from 'react';
import Table from 'react-bootstrap/Table'

export class CountriesTable extends React.Component {
    constructor() {
        super();
        this.state = {
           currentData: []
        }
    }

    componentDidMount() {
        let self = this;

        let selectedDateData = [];

        _.forEach(this.props.timelineData, function(country) {
            let selectedDateCountryData = _.filter(country, function(o) { 
                return o.date == self.props.currentDate;
            })
            selectedDateData.push(selectedDateCountryData[0]);
        })

        this.setState({currentData: selectedDateData});
    }

    componentDidUpdate() {
        
        
    }

    render() {
        let self = this;
        return (
            <Table className="table-sm small">
                <tbody>
                    {
                        _.forEach(this.state.currentData, function(country) {
                            return (
                                <tr key={country.iso_code}><th className="text-capitalize">{country.location}</th><td className="text-end">{country.new_cases}</td></tr>
                            );
                        })
                    }
                </tbody>
            </Table>

        );
    }
}