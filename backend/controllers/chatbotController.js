import axios from "axios";

const azureKey = process.env.AZURE_OPENAI_KEY;
const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT; 
const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT; 
const geminiKey = process.env.GEMINI_API_KEY;

export const askBot = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message required" });

  // ------------------------------
  // 1) AZURE OPENAI ROUTE
  // ------------------------------
  if (azureKey && azureEndpoint && azureDeployment) {
    try {
      const url = `${azureEndpoint}/openai/deployments/${azureDeployment}/chat/completions?api-version=2024-02-01`;

      const response = await axios.post(
        url,
        {
          messages: [
            { role: "system", content: "You are Arogya Mitra, an assistant for PM-JAY and healthcare support." },
            { role: "user", content: message }
          ],
          max_tokens: 500,
          temperature: 0.4
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": azureKey
          }
        }
      );

      const answer = response.data.choices?.[0]?.message?.content || "No reply";
      return res.json({ answer });

    } catch (err) {
      console.error("Azure OpenAI Error:", err.response?.data || err.message);
      return res.status(500).json({ answer: "Azure OpenAI request failed." });
    }
  }

  // ------------------------------
  // 2) GEMINI ROUTE
  // ------------------------------
  if (geminiKey) {
    try {
      const endpoint = process.env.GEMINI_API_ENDPOINT ||
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5:generateContent";

      const response = await axios.post(
        `${endpoint}?key=${geminiKey}`,
        {
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const answer =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";

      return res.json({ answer });

    } catch (err) {
      console.error("Gemini Error:", err.response?.data || err.message);
      return res.status(500).json({ answer: "Gemini request failed." });
    }
  }

  // ------------------------------
  // 3) NO AI CONFIGURED
  // ------------------------------
  return res.json({ answer: "AI not configured. Add Azure or Gemini keys." });
};
