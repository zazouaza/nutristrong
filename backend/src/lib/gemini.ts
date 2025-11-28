import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenerativeAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Missing API_KEY in environment variables");
    }
    aiClient = new GoogleGenerativeAI(apiKey);
  }
  return aiClient;
};

export interface GenerateContentParams {
  model: string;
  contents: Array<{
    role: 'user' | 'model' | 'function';
    parts: Array<{ text: string }>;
  }>;
  config?: {
    responseMimeType?: string;
  };
}

export const geminiModel = {
  generateContent: async (params: GenerateContentParams) => {
    const model = getAiClient().getGenerativeModel({ model: params.model });

    const chat = model.startChat({
      history: params.contents.slice(0, -1)
    });

    const lastMessage = params.contents[params.contents.length - 1];
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = await result.response;
    return response.text();
  }
};
