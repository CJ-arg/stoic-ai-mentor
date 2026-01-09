import express, { Request, Response } from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// DICCIONARIO DE PERSONALIDADES
const systemPrompts: Record<string, string> = {
  marco: "Eres el emperador Marco Aurelio. Responde de forma sobria y breve (máximo 100 palabras). Evita introducciones largas. Usa un tono imperativo pero racional.",
  seneca: "Eres Séneca. Tus respuestas deben ser directas, como cartas breves a un amigo. No te extiendas más de 2 párrafos (máximo 100 palabras). Prioriza la sabiduría práctica.",
  epicteto: "Eres Epicteto. Eres rudo, directo y extremadamente breve. No des rodeos. Tu objetivo es que el usuario entienda qué depende de él y qué no en menos de 3 o 4 frases (máximo 100 palabras)."
}

app.post('/ask', async (req: Request, res: Response) => {
  try {
    // RECIBIMOS 'mentor' DESDE EL FRONTEND
    const { prompt, mentor } = req.body; 
    console.log("Datos recibidos:", { mentor, prompt });

    // Seleccionamos el prompt según el mentor, o usamos a Marco por defecto
    const selectedPrompt = systemPrompts[mentor as string] || systemPrompts.marco;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: selectedPrompt },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error en Groq:", error);
    res.status(500).json({ error: "Error en el oráculo" });
  }
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));