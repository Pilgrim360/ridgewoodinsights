import { getPublishedPostsPage } from '@/lib/blog';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const rawOffset = Number(searchParams.get('offset') ?? '0');
  const rawLimit = Number(searchParams.get('limit') ?? '12');

  const offset = Number.isFinite(rawOffset) ? Math.max(0, rawOffset) : 0;
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(1, rawLimit), 24) : 12;

  const { insights, total } = await getPublishedPostsPage({ offset, limit });

  const nextOffset = offset + insights.length;
  const hasMore = nextOffset < total;

  return Response.json({
    insights,
    total,
    offset,
    limit,
    nextOffset,
    hasMore,
  });
}
