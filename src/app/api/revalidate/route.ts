import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Vercel cron doesn't currently support securing the CRON jobs,
 * but a "shared key" can be configured to prevent potential misuse.
 * We should store it in an environment variable, but `vercel.json` doesn't support
 * reading environment variables, hence keeping it in the source for now.
 *
 * We could of course generate vercel.json or populate it's data during build to
 * put the variables in place, but for this purpose this seems a bit of an overkill.
 *
 * Luckily this endpoint can't do much harm even if called manually.
 *
 * https://vercel.com/docs/cron-jobs#how-to-secure-cron-jobs
 */
const KEY = "c8f7789c-ef59-4a43-a53f-1c34aeea9e37";

/**
 * API route to trigger manual invalidation of the whole site ISR cache. It gets called
 * via a CRON job periodically to keep the site content fresh.
 *
 * This is a workaround to combat 2MB fetch limit for fetching the open positions data.
 * More information in `src/views/Positions/getPositions.ts`.
 */
export function GET({ url }: NextRequest) {
  if (new URL(url).searchParams.get("key") !== KEY) {
    /**
     * An origin server that wishes to "hide" the current existence of a forbidden target resource MAY
     * instead respond with a status code of 404 (Not Found)
     *
     * https://www.rfc-editor.org/rfc/rfc7231#section-6.5.3
     */
    return new NextResponse("Not Found", { status: 404 });
  }
  revalidatePath("/", "layout");

  return new NextResponse(
    JSON.stringify({ revalidated: true, now: Date.now() }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
