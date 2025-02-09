import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: 'Claude API key is not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'claude-2.1',
        messages: [{ role: 'user', content: message }],
        max_tokens_to_sample: 300,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Claude API');
    }

    const data = await response.json();
    res.status(200).json({ message: data.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
}
