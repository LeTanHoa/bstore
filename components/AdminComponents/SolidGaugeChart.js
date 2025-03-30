import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge";

const SolidGaugeChart = () => {
  const trackColors = Highcharts.getOptions().colors.map((color) =>
    new Highcharts.Color(color).setOpacity(0.3).get()
  );

  //   let totalSTNCh = 0; // Declare the totalSTNCh variable

  //   data.forEach((item) => {
  //     item.itemPoints.forEach((point) => {
  //       if (point.status === "") {
  //         totalSTNCh += parseInt(point.sTNCh, 10);
  //       }
  //     });
  //   });

  // Calculate percentage
  const percentage = 30; // Parse the result back to a number

  const options = {
    chart: {
      type: "solidgauge",
      height: "98%",
    },
    tooltip: {
      borderWidth: 0,
      backgroundColor: "none",
      shadow: false,
      style: {
        fontSize: "16px",
        textAlign: "center",
      },
      valueSuffix: "%",
      pointFormat:
        "{series.name}<br>" +
        '<span style="font-size: 1.5em; fontWeight:bold; color: {point.color}; width:100%; font-weight: bold; display: block; text-align: center; margin: 0 auto;">{point.y}</span>',

      positioner: function (labelWidth, labelHeight) {
        return {
          x: (this.chart.chartWidth - labelWidth) / 2,
          y: (this.chart.chartHeight - labelHeight) / 2,
        };
      },
    },
    pane: {
      startAngle: 0,
      endAngle: 360,
      background: [
        {
          outerRadius: "112%",
          innerRadius: "83%",
          backgroundColor: trackColors[0],
          borderWidth: 0,
        },
        {
          outerRadius: "80%",
          innerRadius: "52%",
          backgroundColor: trackColors[2],
          borderWidth: 0,
        },
      ],
    },
    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: [],
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: false,
        },
        linecap: "round",
        stickyTracking: false,
        rounded: true,
      },
    },
    series: [
      {
        name: "",
        data: [
          {
            color: Highcharts.getOptions().colors[0],
            radius: "112%",
            innerRadius: "83%",
            y: 100, // This is now 100%
          },
        ],
        custom: {
          icon: "filter",
          iconColor: "#303030",
        },
      },
      {
        name: ``,
        data: [
          {
            color: Highcharts.getOptions().colors[2],
            radius: "80%",
            innerRadius: "52%",
            y: percentage, // Set the percentage dynamically
          },
        ],
        custom: {
          icon: "commenting-o",
          iconColor: "#303030",
        },
      },
    ],
  };

  return (
    <div className="circle">
      <HighchartsReact highcharts={Highcharts} options={options} />
      {/* <span className="block text-center font-bold">{totalSTNCh}/164</span> */}
    </div>
  );
};

export default SolidGaugeChart;
