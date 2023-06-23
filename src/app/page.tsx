import { LineChart } from "./Chart";
import { PriceData } from "./types";

const endpoint = "https://api.porssisahko.net/v1/latest-prices.json";

export default async function Home() {
  const data = (await (await fetch(endpoint)).json()) as PriceData;
  return <LineChart priceData={data} />;
}
