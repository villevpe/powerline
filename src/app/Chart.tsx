"use client";

import dynamic from "next/dynamic";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((module) => module.ResponsiveLine),
  { ssr: false }
);
import { FC } from "react";
import type { PriceData } from "./types";
import { Theme } from "@nivo/core";

const today = new Date().getTime();

const theme: Theme = {
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
};

export const LineChart: FC<{ priceData: PriceData }> = ({ priceData }) => {
  const { prices } = priceData;

  const data = prices
    .filter(({ startDate }) => new Date(startDate).getTime() > today)
    .map((price, index) => ({
      x: new Date(price.startDate).toISOString(),
      y: price.price,
      id: `data-${index}`,
    }));

  return (
    <div style={{ height: "100vh" }}>
      <ResponsiveLine
        data={[{ id: "prices", data }]}
        margin={{ top: 30, right: 5, bottom: 30, left: 30 }}
        xScale={{ type: "time", format: "%Y-%m-%dT%H:%M:%S.%LZ" }}
        xFormat="time:%Y-%m-%d %H:%M"
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        enableArea={true}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          format: "%H:%M",
          tickValues: "every 2 hours",
          legend: "time scale",
          legendOffset: -12,
        }}
        enableGridX={false}
        enableGridY={true}
        lineWidth={4}
        enablePoints={false}
        useMesh={true}
        enableSlices={false}
        colors={{ scheme: "paired" }}
        theme={theme}
        tooltipFormat={(value) => {
          return `${value} €/MWh`;
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
                }}
              >
                {point.data.yFormatted} snt/kWh
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};
