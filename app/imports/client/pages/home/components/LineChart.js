import React from "react";
import Highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";

export default class LineChart extends React.Component {

  render() {
    const { data, chartOptions } = this.props;
    const options = {
      chart: {
        type: "line",
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
          data: data.chartData
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