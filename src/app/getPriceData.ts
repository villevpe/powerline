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

export const getPriceData = async (): Promise<FormattedPriceData> => {
  const data = (await (
    await fetch("https://api.porssisahko.net/v1/latest-prices.json", {
      cache: "force-cache",
    })
  ).json()) as PriceData;

  return formatData(data);
};
