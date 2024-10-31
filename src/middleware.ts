import { getFlagVariation } from '@/app/get-flag-variation';
import { NextRequest, NextResponse } from 'next/server';
import { FeatureFlags, flags } from './app/flags';

export const config = { matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)' };

export async function middleware(req: NextRequest) {
 
  for (const property in flags) {
    const key = property as keyof FeatureFlags;
    const variation = await getFlagVariation({ key, fallback: flags[key] });
    req.nextUrl.searchParams.set(key, variation);
  }

  console.log(`Rewriting ${req.url} -> ${req.nextUrl.toString()}`);

  return NextResponse.rewrite(req.nextUrl);
}