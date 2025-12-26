import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateText = async (prompt: string, systemInstruction?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Text Generation Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string, aspectRatio: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any, // Cast to any to avoid strict enum check if types aren't perfectly aligned yet
          imageSize: "1K"
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};

export const sermonAssistant = async (question: string) => {
  const systemInstruction = `You are a warm, wise, and biblically grounded AI Ministry Assistant for Christ's Ambassadors Celebration Centre (CACC). 
  Your goal is to help members with spiritual questions, summarize sermons, and provide prayer points. 
  Always answer with a tone of encouragement, faith, and love. Use scripture where appropriate.
  If asked about church timings: Sunday Service is 9:00 AM & 11:00 AM.
  `;
  
  return generateText(question, systemInstruction);
};