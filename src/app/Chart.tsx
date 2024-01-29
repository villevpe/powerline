"use client";
import "client-only";

import dynamic from "next/dynamic";
import { FC, useEffect, useState } from "react";
import { useRerenderOnResize } from "./useRerenderOnResize";
import { useLayoutMode } from "./useLayoutMode";
import { FormattedPriceData } from "./getPriceData";

const CHART_PADDING_Y_FRACTION = 0.1;
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
  const [height, setHeight] = useState("100vh");

  useEffect(() => {
    setHeight(`calc(${window.innerHeight * 0.01}px * 100)`);
  }, []);

  if (data.length === 0) {
    return <span>No data :(</span>;
  }

  const smallestPrice = Math.min(...data.map(({ y }) => y));
  const largestPrice = Math.max(...data.map(({ y }) => y));
  const currentPrice = data[data.length - 1].y;

  const min = smallestPrice;
  const max =
    largestPrice + Math.min(largestPrice * CHART_PADDING_Y_FRACTION, 2);

  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={[{ id: "prices", data }]}
        margin={{
          top: 10,
          bottom: 30,
          right: 0,
          left: 30,
        }}
        xScale={{ type: "time", format: "%Y-%m-%dT%H:%M:%S.%LZ" }}
        xFormat="time:%Y-%m-%d %H:%M"
        yScale={{
          type: "linear",
          min,
          max,
          stacked: false,
          reverse: false,
        }}
        enableArea={true}
        areaBaselineValue={min}
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
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: 12,
          crosshair: {
            line: {
              stroke: "rgba(255, 255, 255, 0.75)",
              strokeWidth: 2,
              strokeDasharray: "10 10",
              strokeOpacity: 0.5,
            },
          },
          axis: {
            ticks: {
              text: {
                fill: "rgba(255, 255, 255, 0.5)",
                fontWeight: 600,
                fontSize: 10,
              },
            },
            domain: {
              line: { stroke: "#555" },
            },
          },
          grid: {
            line: {
              stroke: "rgba(255, 255, 255, 0.15)",
            },
          },
        }}
        tooltip={({ point }) => {
          let move;
          if ([0, 1, 2, 3].includes(point.index)) {
            move = -50 + point.index * 5;
          }

          return (
            <div
              style={{
                transform: move ? `translateX(${move}%)` : undefined,
                transition: "transform 0.2s",
                background: "rgba(0, 0, 0, 0.6)",
                color: point.serieColor,
                padding: "16px 16px",
                fontSize: "0.9rem",
                borderRadius: "9999px",
                border: `2px solid ${point.serieColor}`,
              }}
            >
              {formatDateTime(new Date(point.data.x))}
              <br />
              <strong>{Number(point.data.yFormatted).toFixed(2)} c</strong>
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
