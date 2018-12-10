import React from "react";
import Highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";

export default class BarChart extends React.Component {

  render() {
    const { data, chartOptions } = this.props;
    const options = {
      chart: {
        type: "column"
      },
      colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
      xAxis: {
        categories: data.xAxisValues,
        title: { text: chartOptions.xAxisTitle }
      },
      yAxis: {
        title: { text: chartOptions.yAxisTitle }
      },
      credits: {
        enabled: false
      },
      title: {
        text: chartOptions.title
      },
      series: [
        {
          name: chartOptions.ySeries,
          data: data.yAxisValues
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