import _ from 'lodash';
import React from 'react';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import getCountryISO2 from 'country-iso-3-to-2';
import ReactCountryFlag from 'react-country-flag';

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
            if(selectedDateCountryData[0] !== undefined) {
                selectedDateCountryData[0].new_cases_per_million = parseFloat(selectedDateCountryData[0].new_cases_per_million);
                selectedDateData.push(selectedDateCountryData[0]);
            }
        })

        let selectedDateDataSorted = _.reverse(_.sortBy(selectedDateData, 'new_cases_per_million'));

        let cleanedData = _.filter(selectedDateDataSorted, function(o) {
            return o !== undefined;
        })

        this.setState({currentData: cleanedData});
    }

    componentDidUpdate() {
        
        
    }

    render() {
        let self = this;
        return (
            <>
                <h5>New Cases Per Million on <Badge style={{backgroundColor:'#094151'}}>{self.props.currentDate}</Badge></h5>
                <Table className="table-sm small mt-4">
                    <tbody>
                        {
                            self.state.currentData.map(function(o, index) {
                                return (
                                    <tr key={o.iso_code}>
                                        <td>
                                            <ReactCountryFlag
                                            svg
                                            countryCode={getCountryISO2(o.iso_code)}
                                            style={{
                                                position: 'relative', 
                                                top: '-2px',
                                                fontSize: '1.5em',
                                                lineHeight: '1.5em',
                                            }}
                                            />
                                        </td>
                                        <th className="text-capitalize">{o.location}</th><td className="text-end">{o.new_cases_per_million}</td></tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </>
        );
    }
}