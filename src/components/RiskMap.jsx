import React from 'react';
import * as echarts from 'echarts';
import _ from 'lodash';
import { countriesData } from '../africa.js';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge'
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";


export class RiskMap extends React.Component {
    constructor() {
        super();
        this.state = {
            chartDom: undefined,
            riskChart: undefined,
            selectedDate: undefined,
            selectedDateData: {},
            
            option: {
                title: {
                    text: '',
                    subtext: '',
                    sublink: '',
                    left: 'right'
                },
                tooltip: {
                    trigger: 'item',
                    showDelay: 0,
                    transitionDuration: 0.2,
                    
                },
                visualMap: {
                    left: 'right',
                    top: 'top',
                    min: 0,
                    max: 1,
                    inRange: {
                        color: ['#85C1E9 ', '#F1948A']
                    },
                    text: ['Increasing', 'Decreasing'],  
                    calculable: true
                },
                toolbox: {
                    show: false,
                    left: 'left',
                    top: 'top',
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                series: []
            },

            mapData: [],
        }

        
    }


    componentDidMount() {

        let self = this;

        this.state.chartDom = document.getElementById('echart');
        this.state.riskChart = echarts.init(this.state.chartDom);

        echarts.registerMap('Africa', countriesData);

        let newData = [
            {
                name: 'Increase',
                type: 'map',
                roam: true,
                map: 'Africa',
                emphasis: {
                    label: {
                        show: true
                    }
                },
                select: {
                    itemStyle: {
                        color: 'rgba(255,215,0,0.2)'
                    }
                },
                data: self.state.mapData
            }
        ]
        
        this.state.riskChart.setOption({series: newData});
        this.state.riskChart.setOption(this.state.option);

        this.setState({ selectedDate: this.props.dates[this.props.dates.length-1] });
        
        this.updateRiskMap();

        this.state.riskChart.on('click', function (params) {
            
            console.log(params);
        });


        
    }

    componentDidUpdate() {
    }

    updateRiskMap() {
        let self = this;
        
        let selectedDateData = [];

        _.forEach(this.props.timelineData, function(country) {
            let selectedDateCountryData = _.filter(country, function(o) { 
                return o.date == self.state.selectedDate;
            })
            if(selectedDateCountryData.length > 0) {
                selectedDateCountryData[0].name = selectedDateCountryData[0].location;
                if(selectedDateCountryData[0].iso_code == 'CIV') {
                    selectedDateCountryData[0].name = "Côte d'Ivoire"
                }
                if(selectedDateCountryData[0].iso_code == 'CIV') {
                    selectedDateCountryData[0].name = "Côte d'Ivoire"
                }
                selectedDateCountryData[0].value = selectedDateCountryData[0].increasing_avg;
                selectedDateData.push(selectedDateCountryData[0]);
            }
        })

        let newData = [
            {
                name: 'Increase',
                type: 'map',
                roam: true,
                map: 'Africa',
                emphasis: {
                    label: {
                        show: true
                    },
                    itemStyle: {
                        areaColor: 'rgba(255,215,0,0.2)'
                    }
                },
                select: {
                    itemStyle: {
                        color: 'rgba(255,215,0,0.2)'
                    }
                },
                data: selectedDateData
            }
        ]

        this.state.riskChart.setOption({series: newData});
    }



    changeDate = (render, handle, value, un, percent) => {

        this.setState({selectedDate: this.props.dates[parseInt(value)]});
        this.updateRiskMap();

    }


    render() {
        return (
            <Card className="shadow-sm p-3 mb-5 rounded" style={{ background: 'AliceBlue'}}>
                <Card.Body>
                    <Badge style={{backgroundColor:'#094151'}}>{this.state.selectedDate}</Badge>
                    <div id="echart" style={{width: '100%', height: '50vh'}}></div>
                    <Nouislider range={{ min: 0, max: this.props.dates.length-1 }} start={[this.props.dates.length-1]} onSlide={this.changeDate}/>
                </Card.Body>
            </Card>

        );
    }
}