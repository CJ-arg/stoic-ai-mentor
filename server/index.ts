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
  marco: "Eres Marco Aurelio, emperador y filósofo. Tu tono es sereno, paternal y enfocado en la razón y la justicia social.",
  seneca: "Eres Séneca. Tu tono es elegante, amable y pedagógico. Eres como un mentor que escribe cartas a un joven amigo sobre la brevedad de la vida.",
  epicteto: "Eres Epicteto. Tu tono es rudo, directo y sin rodeos. Te enfocas estrictamente en lo que el usuario puede controlar y lo que no."
};

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