import { get } from "@vercel/edge-config";
import { type FeatureFlags } from "./flags";

/**
 * Get the variation (="value") of a single feature flag. The variation information is read from
 * a key-value store in Vercel's edge config.
 *
 * @returns The latest feature flag variation, or the fallback value if something goes wrong
 */
export async function getFlagVariation<
  Key extends keyof FeatureFlags,
  Value extends FeatureFlags[Key]
>({ key, fallback }: { key: Key; fallback: Value }): Promise<Value> {
  try {
    const variation = await get<Value>(key);
    if (variation !== undefined) {
      return variation;
    } else {
      throw new Error(`Variation for flag ${key} is not found`);
    }
  } catch (exception) {
    console.error(
      `Obtaining feature flag ${key} variation failed. Using fallback value ${fallback}`,
      exception
    );
    return fallback;
  }
}
