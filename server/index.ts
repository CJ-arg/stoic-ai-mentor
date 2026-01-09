import express, { Request, Response } from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// DICCIONARIO DE PERSONALIDADES ESTRUCTURADO (Prompt Engineering Senior)
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

app.post('/ask', async (req: Request, res: Response) => {
  try {
    const { prompt, mentor, language = 'es' } = req.body;

    // 1. Manejo del "Warm up" (Despertador del servidor)
    if (prompt === "Wake up" || prompt === "Despierta") {
      console.log("Servidor despertado con éxito.");
      return res.json({ answer: "Logos online." });
    }

    // 2. Selección del Prompt Base
    const basePrompt = STOIC_PROMPTS[mentor as string] || STOIC_PROMPTS.marco;

    // 3. Inyección dinámica de Idioma (I18n técnica)
    const systemPrompt = `
      ${basePrompt}
      LANGUAGE: You must respond strictly in ${language === 'en' ? 'English' : 'Spanish'}.
      Maintain historical accuracy and a stoic demeanor at all times.
    `;

    console.log(`Petición recibida: [Mentor: ${mentor}] [Idioma: ${language}]`);

    // 4. Llamada a Groq con parámetros optimizados
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6, // Equilibrio entre creatividad y rigor
      max_tokens: 200,   // Garantiza respuestas cortas y eficientes
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error en Groq SDK:", error);
    res.status(500).json({ error: "Error en el oráculo: El Logos está temporalmente fuera de alcance." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`--- Servidor Estoico Online ---`);
  console.log(`Puerto: ${PORT}`);
  console.log(`LTI (Logic, Truth, Integrity) ready.`);
});