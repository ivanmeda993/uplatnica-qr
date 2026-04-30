import { NextResponse } from 'next/server';

import { getIndexNowKey, getSiteUrl } from '@/lib/site';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';

interface IndexNowBody {
  urls?: ReadonlyArray<string>;
}

export async function POST(request: Request) {
  const key = getIndexNowKey();
  if (!key) {
    return NextResponse.json({ ok: false, error: 'INDEXNOW_KEY not configured' }, { status: 503 });
  }

  const auth = request.headers.get('authorization');
  if (!auth || auth !== `Bearer ${key}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as IndexNowBody;
  const urls = body.urls?.length ? body.urls : [getSiteUrl() + '/'];

  const host = new URL(getSiteUrl()).host;
  const payload = {
    host,
    key,
    keyLocation: `${getSiteUrl()}/${key}.txt`,
    urlList: urls,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  return NextResponse.json(
    { ok: res.ok, status: res.status, urls: urls.length },
    { status: res.ok ? 200 : 502 }
  );
}
