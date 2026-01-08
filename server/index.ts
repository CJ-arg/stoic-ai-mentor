import express, { type Request, type Response } from 'express'; 
// Express: El marco que construye las paredes y puertas de nuestro servidor.
// Request/Response: Los tipos de TypeScript para saber qué entra y qué sale.

import cors from 'cors'; 
// CORS: El guardia de seguridad que permite que tu futuro Frontend (React) hable con este Backend.

import dotenv from 'dotenv'; 
// Dotenv: El bibliotecario que busca tus llaves secretas en el archivo .env.

import Groq from 'groq-sdk'; 
// Groq: La nueva herramienta que nos conecta con el modelo Llama 3 (el cerebro de la IA).

dotenv.config(); 
// Carga las variables del .env en la memoria del sistema (process.env).

const app = express(); 
// Creamos la aplicación servidor.

const port = process.env.PORT || 3000; 
// Definimos el puerto 3000 como nuestra dirección de escucha.

// --- CONFIGURACIÓN DE LA IA ---
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); 
// Inicializamos Groq con la llave que pegaste en el .env.

app.use(cors()); 
// Habilitamos CORS para que no haya bloqueos de conexión desde el navegador.

app.use(express.json()); 
// Le enseñamos al servidor a leer el formato JSON (el idioma en que viajan los datos).

// --- RUTA PRINCIPAL (El Oráculo) ---
app.post('/ask', async (req: Request, res: Response) => { 
  // Creamos la ruta POST '/ask'. Es 'async' porque la IA tarda un momento en pensar.
  
  try {
    const { prompt } = req.body; 
    // Extraemos la pregunta que el usuario escribió en el cuerpo del mensaje.

    // Llamada a la API de Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system", 
          // El 'system' define quién es la IA. Aquí le damos el alma de Marco Aurelio.
          content: "Eres Marco Aurelio, el emperador estoico. Responde de forma breve, sabia y serena. Usa conceptos del estoicismo para guiar al usuario."
        },
        {
          role: "user", 
          // El 'user' es lo que el usuario acaba de preguntar.
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile", 
      // Seleccionamos el modelo. Este es muy inteligente y está disponible gratis en Groq.
    });

    // Extraemos el texto de la respuesta de la estructura compleja que devuelve Groq.
    const answer = completion.choices[0]?.message?.content || "";

    res.json({ answer }); 
    // Enviamos la respuesta de vuelta al usuario en formato JSON.

  } catch (error: any) {
    // Si algo falla (ej: internet caído), atrapamos el error aquí.
    console.error("ERROR EN EL SERVIDOR:", error.message);
    
    res.status(500).json({ 
      error: 'El oráculo está meditando, intenta luego.',
      details: error.message 
    });
  }
});

// --- RUTA DE PRUEBA ---
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor del Coach Estoico (vía Groq) listo y funcionando 🛡️.');
});

// --- ENCENDIDO ---
app.listen(port, () => {
  console.log(`⚡ Coach Estoico escuchando en http://localhost:${port}`);
});