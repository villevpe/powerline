import { LineChart } from "./Chart";
import { PriceData } from "./types";

const endpoint = "https://api.porssisahko.net/v1/latest-prices.json";

export default async function Home() {
  const data = (await (
    await fetch(endpoint, { next: { revalidate: 60 * 5 } })
  ).json()) as PriceData;
  return <LineChart priceData={data} />;
}
