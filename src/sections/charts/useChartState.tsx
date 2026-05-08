import "./chartSetup";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import type { ChartData, Point } from "chart.js";
import unemploymentData from "./data/UNRATE.csv?raw";
import salaryData from "./data/MEHOINUSA672N.csv?raw";
import housingData from "./data/ASPUS.csv?raw";
import mcdonaldsData from "./data/MCDONALDS.csv?raw";
import inflationData from "./data/INFLATION.csv?raw";
import fedRateData from "./data/FEDRATE.csv?raw";
import gasData from "./data/GAS.csv?raw";

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const year = date.getUTCFullYear();
  return year;
};

interface DataRecord {
  date: string;
  value: number;
}

const convertChartData = (normalize: boolean, chartConfig: IChartConfig): ChartData<"line"> => {
  const jsonData = Papa.parse<DataRecord>(chartConfig.data, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  }).data;
  const labels = jsonData.map((row) => formatDate(row.date));
  const firstValue = jsonData[0].value;
  const normalizeValue = (val: number) => {
    return (100 * (val - firstValue)) / firstValue;
  };
  return {
    labels,
    datasets: [
      {
        // label: "Cost of McDonald's Cheeseburger ($)",
        data: jsonData.map((row) => (normalize ? normalizeValue(row.value) : row.value)),
        borderColor: chartConfig.color,
        backgroundColor: `${chartConfig.color}45`,
        fill: true,
        tension: 0.2,
        pointRadius: 1,
      },
    ],
  };
};

interface IChartConfig {
  title: string;
  chartType: string;
  data: string;
  color: string;
  dataType: string;
}
const chartConfigs: IChartConfig[] = [
  {
    title: "Average House Sales Price",
    chartType: "line",
    data: housingData,
    color: "#3ba836",
    dataType: "currency",
  },
  {
    title: "Median Household Income",
    chartType: "line",
    data: salaryData,
    color: "#ab38e0",
    dataType: "currency",
  },
  {
    title: "Cost of McDonald's Cheeseburger",
    chartType: "line",
    data: mcdonaldsData,
    color: "#52a6eb",
    dataType: "currency",
  },
  {
    title: "Federal Unemployment",
    chartType: "line",
    data: unemploymentData,
    color: "#f5c242",
    dataType: "percentage",
  },
  {
    title: "Inflation",
    chartType: "line",
    data: inflationData,
    color: "#f70511",
    dataType: "currency",
  },
  {
    title: "Fed Rate",
    chartType: "line",
    data: fedRateData,
    color: "#ff00b3",
    dataType: "percentage",
  },
  {
    title: "Gas Prices",
    chartType: "line",
    data: gasData,
    color: "#f57a00",
    dataType: "currency",
  },
];

const useChartState = () => {
  const relativeTitle = "Percent Increase Since 1984";
  const [title, setTitle] = useState(relativeTitle);
  const [dataType, setDataType] = useState<string>("percentage");
  const [activeCharts, setActiveCharts] = useState<string[]>(["Median Household Income", "Inflation"]);
  const [data, setData] = useState<ChartData<"line", (number | Point | null)[], unknown>>();

  const changeChart = (chartConfig: IChartConfig) => {
    const chartIsActive = activeCharts.some((title) => title === chartConfig.title);
    const newCharts = chartIsActive
      ? activeCharts.filter((title) => title !== chartConfig.title)
      : [...activeCharts, chartConfig.title];
    if (!newCharts.length) return;
    buildChartData(newCharts);
  };

  const buildChartData = (newCharts: string[]) => {
    setActiveCharts(newCharts);
    if (newCharts.length === 1) {
      const matchingChartConfig = chartConfigs.find((config) => config.title === newCharts[0]);
      if (!matchingChartConfig) return;
      setTitle(matchingChartConfig.title);
      setDataType(matchingChartConfig.dataType);
    } else {
      setTitle(relativeTitle);
      // setTitle("Normalized Timeseries Analysis");
      setDataType("percentage");
    }
    const chartDataArray = newCharts.map((title) => {
      const matchingConfig = chartConfigs.find((config) => config.title === title);
      if (!matchingConfig) return;
      return convertChartData(newCharts.length > 1, matchingConfig);
    });
    const resolvedChartData = chartDataArray.reduce(
      (acc, chartConfig, index) => {
        if (!chartConfig || !acc) return acc;
        return {
          labels: index === 0 ? chartConfig.labels : acc.labels,
          datasets: [...acc.datasets, ...chartConfig.datasets],
        };
      },
      { labels: [], datasets: [] },
    );
    setData(resolvedChartData);
  };

  useEffect(() => {
    changeChart(chartConfigs[0]);
  }, []);

  return { activeCharts, setActiveCharts, data, title, chartConfigs, changeChart, dataType };
};

export default useChartState;
