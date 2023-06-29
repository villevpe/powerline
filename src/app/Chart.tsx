"use client";

import dynamic from "next/dynamic";
import { FC } from "react";
import { useRerenderOnResize } from "./useRerenderOnResize";
import { useLayoutMode } from "./useLayoutMode";
import { FormattedPriceData } from "./getPriceData";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then(({ ResponsiveLine }) => ResponsiveLine),
  { ssr: false }
);

export const LineChart: FC<{ data: FormattedPriceData }> = ({ data }) => {
  useRerenderOnResize();
  const layout = useLayoutMode();
  const padding = layout === "desktop" ? 20 : 15;

  const height =
    typeof window !== "undefined"
      ? `calc(${window.innerHeight * 0.01}px * 100)`
      : "100vh";

  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={[{ id: "prices", data }]}
        margin={{
          top: 0,
          right: padding,
          bottom: padding * 2,
          left: padding * 1.75,
        }}
        xScale={{ type: "time", format: "%Y-%m-%dT%H:%M:%S.%LZ" }}
        xFormat="time:%Y-%m-%d %H:%M"
        yScale={{
          type: "linear",
          min: 0,
          // Largest value + 5% of the largest value
          max: Math.max(...data.map(({ y }) => y)) * 1.05,
          stacked: true,
          reverse: false,
        }}
        enableArea={true}
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
        lineWidth={1}
        enablePoints={false}
        useMesh={true}
        enableSlices={false}
        colors={{ size: 3, scheme: "yellow_orange_red" }}
        theme={{
          crosshair: {
            line: {
              stroke: "#FFF",
              strokeWidth: 1,
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
                padding: "9px 12px",
                border: "1px solid #ccc",
              }}
            >
              <div
                style={{
                  color: point.serieColor,
                  padding: "3px 0",
                  fontSize: "0.9em",
                }}
              >
                {formatDateTime(new Date(point.data.x))}
                <br />
                {point.data.yFormatted} snt / kWh
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

// Format to DD.MM klo HH:MM
const formatDateTime = (date: Date) =>
  `${date.getDate()}.${date.getMonth() + 1} klo ${date.getHours()}:${
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  }`;
