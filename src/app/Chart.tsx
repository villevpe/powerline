"use client";

import dynamic from "next/dynamic";
import { FC } from "react";
import { useRerenderOnResize } from "./useRerenderOnResize";
import { useLayoutMode } from "./useLayoutMode";
import { FormattedPriceData } from "./getPriceData";

const CHART_PADDING_Y = 2;
const HIGH_PRICE_LIMIT = 20;

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then(({ ResponsiveLine }) => ResponsiveLine),
  { ssr: false }
);

export const LineChart: FC<{ data: FormattedPriceData }> = ({
  data: allData,
}) => {
  useRerenderOnResize();
  const layout = useLayoutMode();

  const data = filterData(allData);

  const height =
    typeof window !== "undefined"
      ? `calc(${window.innerHeight * 0.01}px * 100)`
      : "100vh";

  const smallestPrice = Math.min(...data.map(({ y }) => y));
  const largestPrice = Math.max(...data.map(({ y }) => y));
  const currentPrice = data[data.length - 1].y;

  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={[{ id: "prices", data }]}
        margin={{
          top: 0,
          bottom: 30,
          right: 50,
          left: 50,
        }}
        xScale={{ type: "time", format: "%Y-%m-%dT%H:%M:%S.%LZ" }}
        xFormat="time:%Y-%m-%d %H:%M"
        yScale={{
          type: "linear",
          min: smallestPrice - CHART_PADDING_Y,
          max: largestPrice + CHART_PADDING_Y,
          stacked: false,
          reverse: false,
        }}
        enableArea={true}
        areaBaselineValue={0}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          // If day changes, show the date, otherwise show the hour
          format: (value) => {
            const date = new Date(value);
            const previousDate = new Date(value - 1000 * 60 * 60);
            return date.getDate() !== previousDate.getDate()
              ? date.toLocaleDateString(
                  "fi-FI",
                  layout === "desktop"
                    ? {
                        day: "numeric",
                        month: "numeric",
                      }
                    : { weekday: "short" }
                )
              : date.getHours();
          },
          tickValues: layout === "desktop" ? "every 1 hours" : "every 3 hours",
        }}
        enableGridX={false}
        enableGridY={true}
        lineWidth={3}
        enablePoints={false}
        useMesh={true}
        enableSlices={false}
        curve="monotoneX"
        colors={[percentToColor(100 - (currentPrice / HIGH_PRICE_LIMIT) * 100)]}
        theme={{
          crosshair: {
            line: {
              stroke: "#FFF",
              strokeWidth: 2,
              strokeDasharray: "10 10",
              strokeOpacity: 0.5,
            },
          },
          axis: {
            ticks: {
              text: { fill: "#FFF" },
            },
            domain: {
              line: { stroke: "#555" },
            },
          },
          grid: {
            line: {
              stroke: "#555",
            },
          },
        }}
        tooltip={({ point }) => {
          return (
            <div
              style={{
                background: "#000",
                color: point.serieColor,
                padding: "8px 16px",
                fontSize: "1rem",
                borderRadius: "9999px",
                border: `1px solid ${point.serieColor}`,
              }}
            >
              ⚡ {formatDateTime(new Date(point.data.x))}
              <br />
              <strong>
                {((point.data.yFormatted as number) / 100).toFixed(3)} €
              </strong>
            </div>
          );
        }}
      />
    </div>
  );
};

// Format to HH:MM
const formatDateTime = (date: Date) =>
  `${date.getHours()}:${
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  }`;

const filterData = (data: FormattedPriceData) => {
  // Current time minus 2 hours
  const start = new Date().getTime() - 1000 * 60 * 60 * 2;
  return data.filter(({ x }) => new Date(x).getTime() >= start);
};

function percentToColor(perc: number) {
  let r,
    g,
    b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  } else {
    g = 255;
    r = Math.round(510 - 5.1 * perc);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return "#" + ("000000" + h.toString(16)).slice(-6);
}
