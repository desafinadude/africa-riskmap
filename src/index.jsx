import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import * as Papa from 'papaparse';
import _ from 'lodash';
import { rolling } from './Math';
import { RiskMap } from './components/RiskMap';
import { Chart } from './components/Chart';
import { CountryData } from './components/CountryData';
// import { CountriesTable } from './components/CountriesTable';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

import getCountryISO2 from 'country-iso-3-to-2';
import ReactCountryFlag from 'react-country-flag';

import './app.scss';


export class App extends React.Component {

    constructor(){
        super();
        this.state = {
            loading: true,
            loadingMessage: '...',
            africa: [],
            countriesData: [],
            timelineData: [],
            countries: [],
            fields: [],
            dates: [],
            selectedCountry: '',
            selectedField: 'new_deaths_smoothed_per_million',
            selectedCountryData: {},
            selectedCountryTimelineData: [],
            selectedDate: undefined
        }
    }

    componentDidMount() {
        let self = this;

        self.setState({ loadingMessage: 'DOWNLOADING LATEST DATA...' });

        axios.get('https://covid.ourworldindata.org/data/owid-covid-data.csv')
            .then(function (response) {

                let AfricaData = [];

                self.setState({ loadingMessage: 'PARSING DATA...' });

                Papa.parse(response.data, {
                    worker: true,
                    header: true,
                    step: function(row) {
                        if(row.data.continent == 'Africa') {
                            AfricaData.push(row.data);
                        }
                    },
                    complete: function() {
                        let countriesSplit = _.groupBy(AfricaData, 'iso_code');

                        let countries = [];
                        let fields = [];
                        let countriesData = [];
                        let timelineDataTemp = [];
                        let dates = [];

                        self.setState({ loadingMessage: 'CALCULATING TRENDS...' });

                        _.forEach(countriesSplit, function(value, key) {

                            countries.push({
                                iso_code: value[0].iso_code,
                                location: value[0].location
                            });

                            countriesData.push({
                                aged_65_older: value[0].aged_65_older,
                                aged_70_older: value[0].aged_70_older,
                                cardiovasc_death_rate: value[0].cardiovasc_death_rate,
                                continent: value[0].continent,
                                diabetes_prevalence: value[0].diabetes_prevalence,
                                extreme_poverty: value[0].extreme_poverty,
                                female_smokers: value[0].female_smokers,
                                gdp_per_capita: value[0].gdp_per_capita,
                                handwashing_facilities: value[0].handwashing_facilities,
                                human_development_index: value[0].human_development_index,
                                iso_code: value[0].iso_code,
                                life_expectancy: value[0].life_expectancy,
                                location: value[0].location,
                                male_smokers: value[0].male_smokers,
                                median_age: value[0].median_age,
                                population: value[0].population,
                                population_density: value[0].population_density

                            })

                            _.forEach(value, function(date, key) {
                                
                                timelineDataTemp.push({
                                    date: date.date,
                                    iso_code: date.iso_code,
                                    location: date.location,
                                    hosp_patients: date.hosp_patients,
                                    hosp_patients_per_million: date.hosp_patients_per_million,
                                    hospital_beds_per_thousand: date.hospital_beds_per_thousand,
                                    icu_patients: date.icu_patients,
                                    icu_patients_per_million: date.icu_patients_per_million,
                                    new_cases: date.new_cases,
                                    new_cases_per_million: date.new_cases_per_million,
                                    new_cases_smoothed: date.new_cases_smoothed,
                                    new_cases_smoothed_per_million: date.new_cases_smoothed_per_million,
                                    new_deaths: date.new_deaths,
                                    new_deaths_per_million: date.new_deaths_per_million,
                                    new_deaths_smoothed: date.new_deaths_smoothed,
                                    new_deaths_smoothed_per_million: date.new_deaths_smoothed_per_million,
                                    new_tests: date.new_tests,
                                    new_tests_per_thousand: date.new_tests_per_thousand,
                                    new_tests_smoothed: date.new_tests_smoothed,
                                    new_tests_smoothed_per_thousand: date.new_tests_smoothed_per_thousand,
                                    new_vaccinations: date.new_vaccinations,
                                    new_vaccinations_smoothed: date.new_vaccinations_smoothed,
                                    new_vaccinations_smoothed_per_million: date.new_vaccinations_smoothed_per_million,
                                    people_fully_vaccinated: date.people_fully_vaccinated,
                                    people_fully_vaccinated_per_hundred: date.people_fully_vaccinated_per_hundred,
                                    people_vaccinated: date.people_vaccinated,
                                    people_vaccinated_per_hundred: date.people_vaccinated_per_hundred,
                                    positive_rate: date.positive_rate,
                                    reproduction_rate: date.reproduction_rate,
                                    stringency_index: date.stringency_index,
                                    tests_per_case: date.tests_per_case,
                                    tests_units: date.tests_units,
                                    total_cases: date.total_cases,
                                    total_cases_per_million: date.total_cases_per_million,
                                    total_deaths: date.total_deaths,
                                    total_deaths_per_million: date.total_deaths_per_million,
                                    total_tests: date.total_tests,
                                    total_tests_per_thousand: date.total_tests_per_thousand,
                                    total_vaccinations: date.total_vaccinations,
                                    total_vaccinations_per_hundred: date.total_vaccinations_per_hundred,
                                    weekly_hosp_admissions: date.weekly_hosp_admissions,
                                    weekly_hosp_admissions_per_million: date.weekly_hosp_admissions_per_million,
                                    weekly_icu_admissions: date.weekly_icu_admissions,
                                    weekly_icu_admissions_per_million: date.weekly_icu_admissions_per_million
                                })

                                dates.push(date.date);

                            })
                        });

                        let timelineDataFinal = [];

                        let timelineDataTempSplit =  _.groupBy(timelineDataTemp, 'iso_code');

                        _.forEach(timelineDataTempSplit, function(country, index) {

                            let new_cases_smoothed = _.map(country,'new_cases_smoothed')
        
                            let rollingCases = _.map(new_cases_smoothed, rolling(5,5));    

                            for (let index = 1; index < rollingCases.length; index++) {
                                if(rollingCases[index - 1] >= rollingCases[index]) {
                                    country[index].increasing = 0;
                                } else {
                                    country[index].increasing = 1;
                                }
                            }

                            let increasing = _.map(country, 'increasing')

                            let rollingCasesIncreasing = _.map(increasing, rolling(5,5));    

                            for (let index = 1; index < rollingCasesIncreasing.length; index++) {
                                country[index].increasing_avg = _.mean(_.map(rollingCasesIncreasing[index], _.toNumber));
                            }

                            timelineDataFinal.push(country);

                        })

                        

                        for (let index = 0; index < 1; index++) {
                            fields =  Object.keys(timelineDataTemp[0]);  
                        }

                        self.setState({ countriesData: countriesData });
                        self.setState({ timelineData: timelineDataFinal });
                        self.setState({ countries: countries });
                        self.setState({ fields: _.without(fields, 'date','iso_code','location') });
                        self.setState({ dates: _.sortBy(_.uniq(dates)) });
                        
                        self.setState({ loadingMessage: 'DONE...' });
                        self.setState({ loading: false });

                    }
                });

        })

        
    }

    reset = (e) => {
        this.setState({selectedCountry: ''});
        this.setState({selectedCountryData: {}});
        this.setState({selectedCountryTimelineData: []});
        this.setState({selectedField: 'new_deaths_smoothed_per_million'});
    }

    changeCountryFromMap = (e) => {
        this.changeCountryExecute(e.data.iso_code);
    }

    changeCountry = (e) =>{
        this.changeCountryExecute(e.target.value);
    }

    changeCountryExecute(iso_code) {
        let self = this;

        self.setState({selectedCountry: iso_code});
        self.setState({selectedCountryData: _.filter(self.state.countriesData, function(o) { 
                return o.iso_code == iso_code;
            })[0]
        })

        let selectedCountryTimelineData = _.filter(self.state.timelineData, function(o) { 
            return o[0].iso_code == iso_code;
        })

        self.setState({selectedCountryTimelineData: selectedCountryTimelineData[0] });
    }

    changeField = (e) => {
        this.setState({ selectedField: e.target.value });
    }

    render() {
        
        return (
            <>
                <Navbar bg="white" expand="lg" className="shadow-sm">
                    <Container fluid>
                        <Navbar.Brand href="#home">
                            <img style={{width: '200px'}} src="https://assets.website-files.com/6017e7ecb14082cec5d531af/605dc8591d244b03000f013c_adh-logo.svg"/>
                        </Navbar.Brand>
                        <h4>RiskMap</h4>
                    </Container>
                </Navbar>

                { this.state.loading === true ? 

                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <Spinner animation="border" /><br/>
                        <h6>{ this.state.loadingMessage }</h6>
                    </div>

                : 
                    <Container className="my-5">
                        <Row className="mb-5">
                            <Col md={8}>
                            { this.state.selectedCountry == '' ?
                                <h4>Africa</h4>
                            :
                                <h4><span role="button" onClick={this.reset}>🡰</span>
                                { this.state.selectedCountryData.iso_code != undefined &&
                                <ReactCountryFlag
                                    className="mx-3"
                                    svg
                                    countryCode={getCountryISO2(this.state.selectedCountryData.iso_code)}
                                    style={{
                                        position: 'relative', 
                                        top: '-2px',
                                        fontSize: '1.5em',
                                        lineHeight: '1.5em',
                                    }}
                                />}{this.state.selectedCountryData.location}</h4>
                                
                            }    
                            </Col>
                            <Col md={4}>
                                <select
                                className="form-select form-select-sm" id="country-select"
                                value={this.state.selectedCountry}
                                onChange={this.changeCountry}
                                >
                                    <option key="selectCountry" value="">Select a Country</option>
                                    { this.state.countries.map(({ iso_code, location }, index) => <option key={index} value={iso_code}>{location}</option>) }
                                </select>
                            </Col>
                        </Row>


                        <Row>
                            <Col md={5}>

                                { this.state.selectedCountry != '' ?    

                                    <Card className="shadow-sm p-3 mb-5 bg-body rounded">
                                        <Card.Body>
                                            <CountryData selectedCountryData={this.state.selectedCountryData} />
                                        </Card.Body>
                                    </Card>
                                : 
                                    <RiskMap timelineData={this.state.timelineData} dates={this.state.dates} onChange={this.changeCountryFromMap}/>
                                }

                            </Col>
                            <Col>
                                { this.state.selectedCountry != '' &&

                                    <>
                                    {this.state.selectedCountryTimelineData[this.state.selectedCountryTimelineData.length-1] != undefined &&
                                        <Alert className="shadow-sm" variant={this.state.selectedCountryTimelineData[this.state.selectedCountryTimelineData.length-1].increasing_avg > this.state.selectedCountryTimelineData[this.state.selectedCountryTimelineData.length-2].increasing_avg ? 'danger' : 'info'}>
                                            {this.state.selectedCountryTimelineData[this.state.selectedCountryTimelineData.length-1].increasing_avg > this.state.selectedCountryTimelineData[this.state.selectedCountryTimelineData.length-2].increasing_avg ?
                                                <span>Cases are Increasing</span>
                                            :
                                                <span>Cases are Decreasing</span>
                                            }
                                        </Alert>
                                    }

                                    <Card className="shadow-sm p-3 mb-5 bg-body rounded">
                                        <Card.Body>

                                            { this.state.fields.length > 0 &&
                                                <select
                                                className="form-select form-select-sm mb-4" id="country-select"
                                                value={this.state.selectedField}
                                                onChange={this.changeField}
                                                >
                                                    { this.state.fields.map((field, index) => <option key={index} value={field}>{field}</option>) }
                                                </select>
                                            }

                                            <Chart selectedCountryData={this.state.selectedCountryData} selectedCountryTimelineData={this.state.selectedCountryTimelineData} selectedField={this.state.selectedField} />
                                        </Card.Body>
                                    </Card>

                                    </>

                                
                                    // <Card className="shadow-sm p-3 mb-5 bg-body rounded"> 
                                    //     <Card.Body>
                                    //         <CountriesTable timelineData={this.state.timelineData} currentDate={this.state.dates[this.state.dates.length-1]}/>
                                    //     </Card.Body>
                                    // </Card>
                                            
                                }

                            </Col>
                        </Row>
                    </Container>
                    
                }
            </>
        );
    }
}

const container = document.getElementsByClassName('app')[0];

ReactDOM.render(React.createElement(App), container);