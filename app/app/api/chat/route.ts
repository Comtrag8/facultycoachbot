export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: body.message }]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'Sorry, I didn’t get that.';

  return new Response(JSON.stringify({ reply }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}
