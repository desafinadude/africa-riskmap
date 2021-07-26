import _ from 'lodash';
import React from 'react';
import Table from 'react-bootstrap/Table'

export class CountryData extends React.Component {
    constructor() {
        super();
        this.state = {
            countryDataTable: {}
        }
    }

    componentDidMount() {
        this.setState({countryDataTable: this.props.selectedCountryData});
    }

    componentDidUpdate() {
        if(this.state.countryDataTable != this.props.selectedCountryData) {
            this.setState({countryDataTable: this.props.selectedCountryData});
        }
        
    }

    render() {
        let self = this;
        return (
            <Table className="table-sm small">
                <tbody>
                    {
                        Object.keys(self.state.countryDataTable).map(function(keyName, keyIndex) {
                            return (
                                <tr key={keyIndex}><th className="text-capitalize">{keyName.replace('_',' ')}</th><td className="text-end">{self.state.countryDataTable[keyName]}</td></tr>
                            );
                        })
                    }
                </tbody>
            </Table>

        );
    }
}