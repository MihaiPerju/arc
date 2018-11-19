import React from "react";
import Highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";

export default class PieChart extends React.Component {

  render() {
    const { data, chartOptions } = this.props;
    console.log(data.chartData);
    const options = {
      chart: {
        type: "pie",
        width: 640
      },
      xAxis: {
        title: { text: chartOptions.xAxisTitle }
      },
      yAxis: {
        title: { text: chartOptions.yAxisTitle }
      },
      title: {
        text: chartOptions.title
      },
      series: [
        {
          name: chartOptions.ySeries,
          data: [{
            name: '1',
            y: 61.41,
          }, {
            name: 'Internet Explorer',
            y: 11.84
          }, {
            name: 'Firefox',
            y: 10.85
          }, {
            name: 'Edge',
            y: 4.67
          }, {
            name: 'Safari',
            y: 4.18
          }, {
            name: 'Sogou Explorer',
            y: 1.64
          }, {
            name: 'Opera',
            y: 1.6
          }, {
            name: 'QQ',
            y: 1.2
          }, {
            name: 'Other',
            y: 2.61
          }]
        }
      ]
    };
    return (
      <div>
        <ReactHighcharts highcharts={Highcharts} options={options} />
      </div>
    );
  }

}