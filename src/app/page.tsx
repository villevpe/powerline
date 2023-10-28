import { LineChart } from "./Chart";
import { preload, getPriceData } from "./getPriceData";

export default async function Home() {
  preload();
  const data = await getPriceData();

  return <LineChart data={data} />;
}
