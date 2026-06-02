
export async function GET(request: Request) {
  const url = new URL(request.url);
  return new Response(
    JSON.stringify({
      platform: 'android',
      status: 'ok',
      message: 'Android API is available',
      timestamp: new Date().toISOString(),
      query: Object.fromEntries(url.searchParams.entries()),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  return new Response(
    JSON.stringify({
      platform: 'android',
      status: 'created',
      body,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
