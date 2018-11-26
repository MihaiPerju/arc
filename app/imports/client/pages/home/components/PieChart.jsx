import React from "react";
import Highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";
export default class PieChart extends React.Component {

  preparePieChartData() {
    let chartData = [];
    const { data } = this.props;
    chartData = data.map(d => {
      return { name: d[0].toString(), y: d[1] };
    });
    return chartData;
  }

  render() {
    const { chartOptions } = this.props;
    let chartData = this.preparePieChartData();
    const options = {
      chart: {
        type: "pie",
        width: 640
      },
      colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
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
          data: chartData
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