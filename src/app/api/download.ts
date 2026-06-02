export async function GET() {
  const projectApi = {
    project: 'booking',
    version: '1.0.0',
    description: 'Booking app API endpoints',
    endpoints: [
      '/api/android',
      '/api/download',
    ],
    generatedAt: new Date().toISOString(),
  };

  const payload = JSON.stringify(projectApi, null, 2);

  return new Response(payload, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="booking-api.json"',
    },
  });
}
