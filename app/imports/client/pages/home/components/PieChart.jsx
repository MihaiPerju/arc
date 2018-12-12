import React from "react";
import Highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";
import { ManagerWidgets } from "../enums/widgetType";

export default class PieChart extends React.Component {

  preparePieChartData() {
    let chartData = [];
    const { data, chartOptions } = this.props;

    if (chartOptions.widgetType == ManagerWidgets.PUSH_TO_CALL || chartOptions.widgetType == ManagerWidgets.AGED_ACCOUNTS || chartOptions.widgetType == ManagerWidgets.TURN_TIME) {
      chartData = data.xAxisValues.map((e, i) => {
        return { name: e, y: data.yAxisValues[i] };
      });
    }
    else {
      chartData = data.map(d => {
        return { name: d[0].toString(), y: d[1] };
      });
    }
    return chartData;
  }

  render() {
    const { chartOptions } = this.props;
    let chartData = this.preparePieChartData();
    const options = {
      chart: {
        type: "pie",
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
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
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            color: '#000000',
            connectorColor: '#d3d3d3',
          }
        }
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