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
  // Current time minus 2 hours
  const start = new Date().getTime() - 1000 * 60 * 60 * 2;

  return prices
    .filter(({ startDate }) => new Date(startDate).getTime() >= start)
    .map(({ startDate, price }, index) => ({
      x: new Date(startDate).toISOString(),
      y: price,
      id: `data-${index}`,
    }));
};

export const getPriceData = async (): Promise<FormattedPriceData> => {
  const data = (await (
    await fetch("https://api.porssisahko.net/v1/latest-prices.json", {
      next: { revalidate: 60 * 5 },
    })
  ).json()) as PriceData;

  return formatData(data);
};
