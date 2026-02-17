
import { GoogleGenAI, Type } from "@google/genai";
import { AIProvider } from "../App";

// Correct initialization of GoogleGenAI client using process.env.API_KEY.
const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const callOpenAI = async (key: string, messages: any[], responseFormat?: string) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        response_format: responseFormat ? { type: responseFormat } : undefined
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw error;
  }
};

export const getInventoryInsights = async (inventoryData: any[], config: { provider: AIProvider, openAiKey: string }) => {
  const prompt = `
    Analyze the following SCM inventory data and provide actionable insights.
    Identify:
    1. Products at risk of stock-out.
    2. Overstocked items tying up capital.
    3. Suggested reorder quantities based on min/max thresholds.
    4. General supply chain health score (0-100).
    
    Data: ${JSON.stringify(inventoryData)}
  `;

  if (config.provider === 'openai') {
    if (!config.openAiKey) throw new Error("OpenAI API Key is missing");
    const messages = [
      { role: "system", content: "You are a supply chain analyst. Return a JSON object matching the requested schema." },
      { role: "user", content: `${prompt}\n\nPlease return a JSON object with keys: riskLevel (string), insights (array of strings), healthScore (number), recommendations (array of objects with keys sku, action, reason).` }
    ];
    const text = await callOpenAI(config.openAiKey, messages, "json_object");
    return JSON.parse(text);
  } else {
    // Create new instance before call to ensure latest API key from session is used.
    const ai = getGeminiClient();
    try {
      const response = await ai.models.generateContent({
        // Using gemini-3-pro-preview for complex reasoning tasks.
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: { type: Type.STRING },
              insights: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              healthScore: { type: Type.NUMBER },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sku: { type: Type.STRING },
                    action: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ["sku", "action", "reason"]
                }
              }
            },
            required: ["riskLevel", "insights", "healthScore", "recommendations"]
          }
        }
      });
      // Correctly access .text property from GenerateContentResponse.
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Error:", error);
      return null;
    }
  }
};

export const chatWithAdvisor = async (history: { role: string, parts: { text: string }[] }[], config: { provider: AIProvider, openAiKey: string }) => {
  const lastMessage = history[history.length - 1].parts[0].text;
  const systemPrompt = 'You are an expert Supply Chain Advisor named NexBot. Provide concise, professional, and data-driven advice regarding logistics, inventory, and procurement.';

  if (config.provider === 'openai') {
    if (!config.openAiKey) throw new Error("OpenAI API Key is missing");
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map(h => ({
        role: h.role === 'model' || h.role === 'assistant' ? 'assistant' : 'user',
        content: h.parts[0].text
      }))
    ];
    return await callOpenAI(config.openAiKey, messages);
  } else {
    const ai = getGeminiClient();
    // Initialize chat with full history except for the final message which is sent via sendMessage.
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history.slice(0, -1).map(h => ({
        role: h.role,
        parts: h.parts
      })),
      config: {
        systemInstruction: systemPrompt
      }
    });
    //sendMessage accepts a message parameter, extract the text from the last response.
    const response = await chat.sendMessage({ message: lastMessage });
    return response.text;
  }
};
