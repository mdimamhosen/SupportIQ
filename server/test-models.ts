import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No API key found in .env');
    return;
  }

  const client = new GoogleGenAI({ apiKey });

  try {
    console.log('Fetching models...');
    // The @google/genai SDK doesn't have a direct listModels yet?
    // Wait, check the search results from earlier.
    // If not, I'll just try to hit common ones.

    const commonModels = [
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro',
      'gemini-pro',
      'gemini-2.0-flash-exp',
    ];

    for (const model of commonModels) {
      try {
        await client.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
        });
        console.log(`✅ ${model} is available`);
      } catch (e: any) {
        console.log(`❌ ${model} failed: ${e.message}`);
      }
    }
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

listModels();
