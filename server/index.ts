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

// STRUCTURED PERSONALITY DICTIONARY (Senior Prompt Engineering)
const STOIC_PROMPTS: Record<string, string> = {
  marco: `
    ROLE: Marcus Aurelius (Roman Emperor & Stoic).
    TONE: Solemn, rational, and paternal. 
    CONSTRAINTS: 
    - Answer in maximum Between 80 and 130 words. 
    - Stay professional and noble.
    - Focus on what is within the user's control.
    - No emojis. No long lists. 
    - Be extremely concise.
  `,
  seneca: `
    ROLE: Seneca (Statesman and Philosopher).
    TONE: Practical, encouraging, and direct. 
    CONSTRAINTS: 
    - Write as if it were a short letter to a friend. 
    - Max 80 words. 
    - Focus on the value of time and tranquility.
    - Avoid flowery introductions.
  `,
  epicteto: `
    ROLE: Epictetus (Former slave & Stoic teacher).
    TONE: Blunt, rigorous, and slightly harsh. 
    CONSTRAINTS: 
    - Be very direct. No small talk. 
    - Max 50 words. 
    - Remind the user that their opinion of the event is the problem, not the event itself.
  `
};

// --- NEW ENDPOINT: BILINGUAL ORCHESTRATION (IA + EXTERNAL API) ---
app.get('/api/translated-quote', async (_req: Request, res: Response) => {
  try {
    // 1. Fetch original quote (External API Consumption)
    // We add a 5-second timeout to prevent the server from hanging
    const externalResponse = await axios.get('https://stoic-quotes.com/api/quote', { timeout: 5000 });
    const { text: englishText, author } = externalResponse.data;

    // 2. Contextual Translation (LLM Orchestration)
    const translationCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a professional translator specializing in philosophy. Translate the following stoic quote to Spanish. Maintain the solemn and profound tone. Return ONLY the translated text, no quotes or explanations." 
        },
        { role: "user", content: englishText },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, 
      max_tokens: 150, 
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
    // Returning a 503 error if the external services are slow
    // This allows the frontend to fall back to its hardcoded quotes
    res.status(503).json({ error: "Service temporarily warming up." });
  }
});

// MAIN ENDPOINT: /ask (Handles Chat and Wake-up Call)
app.post('/ask', async (req: Request, res: Response) => {
  try {
    const { prompt, mentor, language = 'es' } = req.body;

    // 1. FAST RESPONSE: Wake-up call handling
    // This must return immediately to unlock the Frontend UI
    if (prompt === "Wake up" || prompt === "Despierta") {
      console.log("!!! Wake-up call received - Unlocking Frontend");
      return res.json({ answer: "Logos online." });
    }

    // 2. Base Prompt Selection
    const basePrompt = STOIC_PROMPTS[mentor as string] || STOIC_PROMPTS.marco;

    // 3. Dynamic Language Injection
    const systemPrompt = `
      ${basePrompt}
      LANGUAGE: You must respond strictly in ${language === 'en' ? 'English' : 'Spanish'}.
      Maintain historical accuracy and a stoic demeanor at all times.
    `;

    console.log(`Request received: [Mentor: ${mentor}] [Language: ${language}]`);

    // 4. Call to Groq with optimized parameters
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6, 
      max_tokens: 200, 
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error("Groq SDK Error:", error);
    res.status(500).json({ error: "Oracle error: The Logos is temporarily out of reach." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`--- Stoic Server Online ---`);
  console.log(`Port: ${PORT}`);
  console.log(`LTI (Logic, Truth, Integrity) ready.`);
});