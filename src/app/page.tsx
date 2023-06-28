import { LineChart } from "./Chart";
import { getPriceData } from "./getPriceData";

export default async function Home() {
  const data = await getPriceData();

  return <LineChart data={data} />;
}
