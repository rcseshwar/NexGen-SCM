
import { GoogleGenAI, Type } from "@google/genai";
import { AIProvider } from "../App";

// Private helper to get Gemini client
const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const scmData = {
  scm_overview: {
    weekly_operations: [
      { day: "Mon", inventory: 4000, shipments: 2400 },
      { day: "Tue", inventory: 3000, shipments: 1398 },
      { day: "Wed", inventory: 2000, shipments: 9800 },
      { day: "Thu", inventory: 2780, shipments: 3908 },
      { day: "Fri", inventory: 1890, shipments: 4800 },
      { day: "Sat", inventory: 2390, shipments: 3800 },
      { day: "Sun", inventory: 3490, shipments: 4300 }
    ]
  },
  Vendor: [
    { id: 'V-001', name: 'Global Logistics Inc', category: 'Logistics', rating: 4.8, onTimeRate: 98, contact: 'contact@globallog.com', status: 'Active' },
    { id: 'V-002', name: 'TechRetail Corp', category: 'Distributor', rating: 4.2, onTimeRate: 92, contact: 'ops@techretail.io', status: 'Under Review' },
    { id: 'V-003', name: 'AAJ Supply Chain Management', category: 'Supplier', rating: 3.9, onTimeRate: 85, contact: 'sales@aaj.net', status: 'Active' },
    { id: 'V-004', name: 'DHL', category: 'Logistics', rating: 4.5, onTimeRate: 95, contact: 'dispatch@DHL.com', status: 'Active' },
    { id: 'V-005', name: 'TVS Supply Chain Solutions (TVS SCS)', category: 'Supplier', rating: 4.9, onTimeRate: 99, contact: 'info@tvs.com', status: 'Active' },
  ],
  Shipment: [
    { id: 'SHP-781', orderId: 'ORD-1003', origin: 'Mangalore Port', destination: 'Warehouse A, Hubli', status: 'In Transit', estimatedArrival: 'Feb 28, 2026' },
    { id: 'SHP-902', orderId: 'ORD-998', origin: 'Mangalore Hub', destination: 'Distribution C, Bangalore', status: 'Delayed', estimatedArrival: 'Feb 26, 2026' },
    { id: 'SHP-124', orderId: 'ORD-1015', origin: 'Mangalore Facility', destination: 'Distribution Bidar', status: 'Delivered', estimatedArrival: 'Jan 22, 2026' },
    { id: 'SHP-255', orderId: 'ORD-1022', origin: 'Mangalore Logistics', destination: 'Warehouse B, Bangalore', status: 'In Transit', estimatedArrival: 'Feb 23, 2026' },
    { id: 'SHP-312', orderId: 'ORD-1050', origin: 'Mangalore Port', destination: 'Distribution Mysore', status: 'Delivered', estimatedArrival: 'Jan 15, 2026' },
  ],
  Order: [
    { id: 'ORD-1001', type: 'Purchase', status: 'Approved', vendor: 'Global Logistics Inc', total: 45000.00, createdAt: '2026-01-24' },
    { id: 'ORD-1002', type: 'Sales', status: 'Pending', vendor: 'TechRetail Corp', total: 12000.50, createdAt: '2026-01-25' },
    { id: 'ORD-1003', type: 'Purchase', status: 'Shipped', vendor: 'DHL', total: 8900.00, createdAt: '2026-01-22' },
    { id: 'ORD-1004', type: 'Sales', status: 'Delivered', vendor: 'TVS Supply Chain Solutions (TVS SCS)', total: 23000.00, createdAt: '2026-01-20' },
    { id: 'ORD-1005', type: 'Purchase', status: 'Cancelled', vendor: 'DHL', total: 4500.00, createdAt: '2026-01-18' },
    { id: 'ORD-1006', type: 'Sales', status: 'Delivered', vendor: 'AAJ Supply Chain Management', total: 11000.00, createdAt: '2026-01-19' },
  ],
  Product: [
    { id: '1', sku: 'E-RPP-12', name: 'Recycled Plastic Panels', category: 'Interior & Infrastructure', stockLevel: 45000, minThreshold: 10000, maxThreshold: 100000, price: 1650.00, location: 'WH-A1-22', status: 'In Stock' },
    { id: '2', sku: 'W-PSP-75', name: 'Plastic Shuttering Ply/Panels', category: 'Structural & Foundation', stockLevel: 1200, minThreshold: 5000, maxThreshold: 50000, price: 1375.00, location: 'WH-B2-05', status: 'Low Stock' },
    { id: '3', sku: 'M-PPB-15', name: 'Plastic Paver Blocks', category: 'Interior & Infrastructure', stockLevel: 120000, minThreshold: 10000, maxThreshold: 80000, price: 250.00, location: 'WH-A4-10', status: 'Overstock' },
    { id: '4', sku: 'S-PWC-10', name: 'Plastic-Wood Composite Cladding', category: 'Walls & Roofing', stockLevel: 8500, minThreshold: 2000, maxThreshold: 20000, price: 135.00, location: 'WH-C1-15', status: 'In Stock' },
  ],
};

// Convert to string for sending
const scmJson = JSON.stringify(scmData, null, 2);

// Private helper to call OpenAI
//const callOpenAI = async (key: string, messages: any[], responseFormat?: string) => {
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
        temperature: 0.0,
        messages: [
          {
            role: "system",
            content:
              //"You are a supply chain analytics expert. Analyze the provided SCM data and give clear insights. Replay must be in bullet points with new line."
              //"Return structured JSON with fields: low_stock_products, restock_cost_estimate, risk_level."
              //"You are a supply chain analytics expert."
              "You are an advanced Supply Chain Management analytics engine. Follow strict calculation and risk detection rules."
          },
          {
            role: "user",
            content: `Here is the SCM dataset:\n\n${scmJson}\n\nQuestion: ${responseFormat}`
          }
        ],
        response_format: responseFormat ? { type: responseFormat } : undefined
      })
    });
    
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || "OpenAI API request failed");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Service Error (OpenAI):", error);
    throw error;
  }
};

/**
 * Unified entry point for all AI-powered analysis tasks.
 */
export const runAnalysis = async (task: 'inventory' | 'logistics', data: any, config: { provider: AIProvider, openAiKey: string }) => {
  const prompts = {
    inventory: `Analyze the following SCM inventory data and provide actionable insights. Identify: 1. Stock-out risks. 2. Overstocking. 3. Reorder suggestions. 4. Health score (0-100). Data: ${JSON.stringify(data)}`,
    logistics: `Analyze these shipment routes and fleet data for optimization opportunities: ${JSON.stringify(data)}`
  };

  const prompt = prompts[task];

  if (config.provider === 'openai') {
    if (!config.openAiKey) throw new Error("Please configure your OpenAI API key in the AI Engine settings.");
    const messages = [
      { role: "system", content: "You are an expert SCM Intelligence Engine. Return strictly valid JSON." },
      { role: "user", content: `${prompt}\n\nReturn JSON: { "riskLevel": string, "insights": string[], "healthScore": number, "recommendations": [{ "sku": string, "action": string, "reason": string }] }` }
    ];
    const text = await callOpenAI(config.openAiKey, messages, "json_object");
    return JSON.parse(text);
  } else {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            insights: { type: Type.ARRAY, items: { type: Type.STRING } },
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
    return JSON.parse(response.text || '{}');
  }
};

/**
 * Unified entry point for all conversational AI tasks.
 */
export const runChat = async (history: { role: string, parts: { text: string }[] }[], config: { provider: AIProvider, openAiKey: string }) => {
  const lastMessage = history[history.length - 1].parts[0].text;
  const systemInstruction = 'You are NexBot, a world-class SCM strategist for EcoPlast Materials. Provide data-driven, concise, and professional logistics advice. Always sound authoritative and slightly futuristic.';

  if (config.provider === 'openai') {
    if (!config.openAiKey) throw new Error("Please configure your OpenAI API key in the AI Engine settings.");
    const messages = [
      { role: "system", content: systemInstruction },
      ...history.map(h => ({
        role: h.role === 'model' || h.role === 'assistant' ? 'assistant' : 'user',
        content: h.parts[0].text
      }))
    ];
    return await callOpenAI(config.openAiKey, messages);
  } else {
    const ai = getGeminiClient();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history.slice(0, -1).map(h => ({ role: h.role, parts: h.parts })),
      config: { systemInstruction }
    });
    const response = await chat.sendMessage({ message: lastMessage });
    return response.text || 'TRANSMISSION_ID_TIMEOUT: No output received.';
  }
};
