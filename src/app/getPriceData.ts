import { cache } from "react";
import "server-only";

type PriceData = {
  prices: {
    price: number;
    startDate: string;
    endDate: string;
  }[];
};

export type FormattedPriceData = {
  x: string;
  y: number;
  id: string;
}[];

const formatData = ({ prices }: PriceData) => {
  return prices.map(({ startDate, price }, index) => ({
    x: new Date(startDate).toISOString(),
    y: price,
    id: `data-${index}`,
  }));
};

export const preload = () => {
  void getPriceData();
};

export const getPriceData = cache(async (): Promise<FormattedPriceData> => {
  const data = (await (
    await fetch("https://api.porssisahko.net/v1/latest-prices.json", {
      // 1 hour for now
      next: { revalidate: 3600 },
    })
  ).json()) as PriceData;

  console.log(data);

  return formatData(data);
});
