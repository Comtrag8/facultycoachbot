export async function POST(req: Request) {
  try {
    const body = await req.json();

    const systemPrompt = `You are a realistic AI simulation tool...`; // keep your full prompt here

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt.trim() },
          { role: 'user', content: body.message }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('GPT returned no content:', data);
      return new Response(JSON.stringify({ reply: 'GPT error: No response received.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      });
    }

    const reply = data.choices[0].message.content;
    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ reply: 'Server error occurred.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
