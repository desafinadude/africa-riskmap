import React from 'react';
import * as echarts from 'echarts';
import _ from 'lodash';
import Gradient from 'javascript-color-gradient';

export class Chart extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedCountryData: {},
            selectedCountryTimelineData: [],
            selectedField: '',
            chartDom: undefined,
            genChart: undefined,
            colorGradient: new Gradient(),

            colors: ['#5470C6', '#91CC75', '#094151'],
            option: {
                color: ['#5470C6', '#91CC75', '#094151'],

                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    left: '0%',
                    top: 0,
                    right: '0%',
                    bottom: '17%'
                },
                toolbox: {
                    show: false,
                },
                legend: {
                    data: []
                },
                dataZoom: [
                    {
                        show: true,
                        start: 50,
                        end: 100
                    },
                    {
                        type: 'inside',
                        start: 50,
                        end: 100
                    },
                    
                ],
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        position: 'right',
                        offset: 0,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#5470C6'
                            }
                        },
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '',
                        position: 'left',
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#094151'
                            }
                        },
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: []
            }
        }
    }

    componentDidMount() {
        this.state.colorGradient.setGradient('#85C1E9','#F1948A');
        this.state.genChart = echarts.init(document.getElementById('chart'));
        this.state.genChart.setOption(this.state.option);
        this.updateChart();
    }


    

    componentDidUpdate() {
        if(this.state.selectedCountryData != this.props.selectedCountryData || this.state.selectedField != this.props.selectedField || this.state.selectedCountryTimelineData != this.props.selectedCountryTimelineData) {
            this.setState({ selectedCountryData: this.props.selectedCountryData });
            this.setState({ selectedCountryTimelineData: this.props.selectedCountryTimelineData });
            this.setState({ selectedField: this.props.selectedField });
            this.updateChart();
        }
    }

    updateChart() {
        let categoryDates = _.map(this.props.selectedCountryTimelineData, 'date');
        let casesData = [];
        let otherMetric = [];

        _.each(this.props.selectedCountryTimelineData, (date) => {
            let scale = parseInt(date.increasing_avg * 10 + 1);
            if(isNaN(scale)) scale = 1;

            casesData.push(
                {
                    value: date.new_cases_smoothed,
                    itemStyle: {
                        color: this.state.colorGradient.getColor(scale)
                    }
                }
            )
        })

        _.each(this.props.selectedCountryTimelineData, (date) => {
            otherMetric.push(
                {
                    value: date[this.props.selectedField]
                }
            )
        })

        this.state.genChart.setOption(
            {
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: categoryDates
                    }
                ],
                series: [
                    {
                        name: 'Cases',
                        type: 'bar',
                        data: casesData
                    },
                    {
                        name: this.props.selectedField,
                        type: 'line',
                        yAxisIndex: 1,
                        data: otherMetric,
                        itemStyle: {
                            borderWidth: 3,
                            width: 2,
                            color: '#094151'
                        }
                    },

                  
                ]

            }
        )

    }

    render() {
        return (
            <>
            <div id="chart" style={{width: '100%', height: '400px'}}></div>
            </>
        );
    }
}