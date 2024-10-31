import { LineChart } from "./Chart";
import { FeatureFlags } from "./flags";
import { getPriceData } from "./getPriceData";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<FeatureFlags>;
}) {
  const data = await getPriceData();
  const params = await searchParams;
  return <LineChart data={data} colorScheme={params['color-scheme']} />;
}
