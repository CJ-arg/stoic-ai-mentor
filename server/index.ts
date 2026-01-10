import express, { Request, Response } from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const STOIC_PROMPTS: Record<string, string> = {  };

app.get('/api/translated-quote', async (_req: Request, res: Response) => {
  try {
    // 1. Fetch original quote (External API Consumption)
    const externalResponse = await axios.get('https://stoic-quotes.com/api/quote');
    const { text: englishText, author } = externalResponse.data;

    // 2. Contextual Translation (LLM Orchestration)
    // We don't use a generic prompt; we instruct the AI to maintain the stoic tone
    const translationCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a professional translator specializing in philosophy. Translate the following stoic quote to Spanish. Maintain the solemn and profound tone. Return ONLY the translated text, no quotes or explanations." 
        },
        { role: "user", content: englishText },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Low temperature for higher translation fidelity
    });

    const spanishText = translationCompletion.choices[0].message.content;

    // 3. Structured bilingual response
    res.json({
      englishText,
      spanishText,
      author
    });
  } catch (error) {
    console.error("Error in bilingual quote orchestration:", error);
    res.status(500).json({ error: "Could not synchronize the bilingual Logos." });
  }
});

// ENDPOINT /ask... (Your current logic remains the same)
app.post('/ask', async (req: Request, res: Response) => {
  // ... your existing code ...
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`--- Stoic Server Online ---`);
  console.log(`Port: ${PORT}`);
  console.log(`LTI (Logic, Truth, Integrity) ready.`);
});