import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function CustomPieChart(props) {
  const { data } = props;
  const handleChart = () => {
    if (data?.length > 1) {
      return (
        <PieChart
          title="Sectors count from FormData"
          series={[
            {
              data,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          height={200}
        />
      );
    } else {
      return null;
    }
  };

  return handleChart();
}
