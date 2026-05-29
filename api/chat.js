// api/chat.js (This turns into a secure backend serverless function)
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userPrompt } = req.body;

    // Call OpenRouter securely using the server's hidden environment variable
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // Hidden key!
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/free", // The free model ID
        messages: [{ role: "user", content: userPrompt }]
      })
    });

    const data = await response.json();
    const aiText = data.choices[0].message.content;

    // Send just the text back to your frontend app
    return res.status(200).json({ text: aiText });

  } catch (error) {
    return res.status(500).json({ error: "Backend failed to fetch AI response" });
  }
}
